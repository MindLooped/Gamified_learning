const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { EcoTask, TaskCompletion, User } = require('../models');

// Generate QR Code for Eco-Task
router.post('/generate-qr', async (req, res) => {
  try {
    const { taskId, location, validUntil } = req.body;
    
    const qrData = {
      taskId,
      location,
      timestamp: Date.now(),
      validUntil: validUntil || Date.now() + (24 * 60 * 60 * 1000), // 24 hours default
      verification: generateVerificationHash(taskId, location)
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
    
    // Update task with QR code
    await EcoTask.findByIdAndUpdate(taskId, { qrCode: qrCode });

    res.json({
      success: true,
      qrCode,
      qrData,
      expiresAt: new Date(qrData.validUntil)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify QR Code Scan
router.post('/verify-qr', async (req, res) => {
  try {
    const { userId, qrData, location } = req.body;
    
    // Parse QR data
    const scanData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    
    // Verify QR code is still valid
    if (Date.now() > scanData.validUntil) {
      return res.status(400).json({ error: 'QR code has expired' });
    }

    // Verify location (within 100m radius)
    if (!verifyLocation(scanData.location, location)) {
      return res.status(400).json({ error: 'Location verification failed' });
    }

    // Verify hash
    const expectedHash = generateVerificationHash(scanData.taskId, scanData.location);
    if (scanData.verification !== expectedHash) {
      return res.status(400).json({ error: 'Invalid QR code' });
    }

    // Check if user already completed this task
    const existingCompletion = await TaskCompletion.findOne({
      user: userId,
      task: scanData.taskId,
      verificationStatus: 'verified'
    });

    if (existingCompletion) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // Get task details
    const task = await EcoTask.findById(scanData.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Create completion record
    const completion = new TaskCompletion({
      user: userId,
      task: scanData.taskId,
      verificationStatus: 'verified',
      evidence: {
        type: 'qr-scan',
        data: qrData,
        metadata: {
          location,
          scannedAt: new Date(),
          taskLocation: scanData.location
        }
      },
      pointsAwarded: task.points
    });

    await completion.save();

    // Award points to user
    await awardPoints(userId, task.points);

    res.json({
      success: true,
      message: 'Task completed successfully!',
      pointsAwarded: task.points,
      taskTitle: task.title
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Teacher/NGO Verification Dashboard
router.get('/pending-verifications', async (req, res) => {
  try {
    const { verifierId, role } = req.query;
    
    let query = { verificationStatus: 'pending' };
    
    // If teacher, only show their school's tasks
    if (role === 'teacher') {
      const teacher = await User.findById(verifierId);
      const schoolStudents = await User.find({ school: teacher.school, role: 'student' });
      query.user = { $in: schoolStudents.map(s => s._id) };
    }

    const pendingTasks = await TaskCompletion.find(query)
      .populate('user', 'username school class')
      .populate('task', 'title description points category')
      .sort({ completedAt: -1 });

    res.json(pendingTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify/Reject Task Completion
router.post('/verify-completion', async (req, res) => {
  try {
    const { completionId, verifierId, status, feedback } = req.body;
    
    const completion = await TaskCompletion.findById(completionId)
      .populate('user')
      .populate('task');
    
    if (!completion) {
      return res.status(404).json({ error: 'Task completion not found' });
    }

    completion.verificationStatus = status;
    completion.verifiedBy = verifierId;
    completion.feedback = feedback;

    if (status === 'verified') {
      // Award points
      await awardPoints(completion.user._id, completion.task.points);
      completion.pointsAwarded = completion.task.points;
    }

    await completion.save();

    res.json({
      success: true,
      message: `Task ${status} successfully`,
      completion
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper Functions
function generateVerificationHash(taskId, location) {
  const crypto = require('crypto');
  const data = `${taskId}-${location}-${process.env.QR_SECRET || 'ecolearn-secret'}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}

function verifyLocation(expectedLocation, actualLocation) {
  // Simple location verification (in production, use proper geolocation)
  if (!expectedLocation || !actualLocation) return true;
  
  const distance = calculateDistance(
    expectedLocation.lat, expectedLocation.lng,
    actualLocation.lat, actualLocation.lng
  );
  
  return distance <= 0.1; // 100m radius
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function awardPoints(userId, points) {
  const user = await User.findById(userId);
  user.ecoPoints += points;
  user.totalPoints += points;
  await user.save();
}

module.exports = router;