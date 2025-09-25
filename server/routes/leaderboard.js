const express = require('express');
const router = express.Router();
const { User, Leaderboard, TaskCompletion } = require('../models');

// Get Leaderboard Data
router.get('/:period/:category', async (req, res) => {
  try {
    const { period, category } = req.params;
    const { school, class: userClass } = req.query;

    let dateFilter = {};
    const now = new Date();

    // Set date filter based on period
    switch (period) {
      case 'daily':
        dateFilter = { 
          updatedAt: { 
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) 
          } 
        };
        break;
      case 'weekly':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter = { updatedAt: { $gte: weekStart } };
        break;
      case 'monthly':
        dateFilter = { 
          updatedAt: { 
            $gte: new Date(now.getFullYear(), now.getMonth(), 1) 
          } 
        };
        break;
      case 'all-time':
      default:
        // No date filter for all-time
        break;
    }

    let leaderboard;

    if (category === 'individual') {
      // Individual leaderboard
      let userFilter = {};
      if (school) userFilter.school = school;
      if (userClass) userFilter.class = userClass;

      leaderboard = await User.find(userFilter)
        .select('username school class ecoPoints totalPoints avatar level')
        .sort({ totalPoints: -1 })
        .limit(100);

      // Add rankings
      leaderboard = leaderboard.map((user, index) => ({
        ...user.toObject(),
        rank: index + 1
      }));

    } else if (category === 'class') {
      // Class leaderboard
      leaderboard = await User.aggregate([
        { $match: school ? { school } : {} },
        {
          $group: {
            _id: { school: '$school', class: '$class' },
            totalPoints: { $sum: '$totalPoints' },
            studentCount: { $sum: 1 },
            avgPoints: { $avg: '$totalPoints' }
          }
        },
        { $sort: { totalPoints: -1 } },
        { $limit: 50 },
        {
          $project: {
            school: '$_id.school',
            class: '$_id.class',
            totalPoints: 1,
            studentCount: 1,
            avgPoints: { $round: ['$avgPoints', 0] }
          }
        }
      ]);

      // Add rankings
      leaderboard = leaderboard.map((item, index) => ({
        ...item,
        rank: index + 1
      }));

    } else if (category === 'school') {
      // School leaderboard
      leaderboard = await User.aggregate([
        {
          $group: {
            _id: '$school',
            totalPoints: { $sum: '$totalPoints' },
            studentCount: { $sum: 1 },
            avgPoints: { $avg: '$totalPoints' },
            topStudent: { $max: '$totalPoints' }
          }
        },
        { $sort: { totalPoints: -1 } },
        { $limit: 20 },
        {
          $project: {
            school: '$_id',
            totalPoints: 1,
            studentCount: 1,
            avgPoints: { $round: ['$avgPoints', 0] },
            topStudent: 1
          }
        }
      ]);

      // Add rankings
      leaderboard = leaderboard.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    }

    res.json({
      period,
      category,
      leaderboard,
      updatedAt: new Date(),
      totalEntries: leaderboard.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Leaderboard Position
router.get('/position/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'all-time', category = 'individual' } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's rank in different categories
    const individualRank = await User.countDocuments({ 
      totalPoints: { $gt: user.totalPoints } 
    }) + 1;

    // Get class rank if user has a class
    let classRank = null;
    if (user.class && user.school) {
      classRank = await User.countDocuments({
        school: user.school,
        class: user.class,
        totalPoints: { $gt: user.totalPoints }
      }) + 1;
    }

    // Get school rank if user has a school
    let schoolRank = null;
    if (user.school) {
      schoolRank = await User.countDocuments({
        school: user.school,
        totalPoints: { $gt: user.totalPoints }
      }) + 1;
    }

    res.json({
      user: {
        username: user.username,
        totalPoints: user.totalPoints,
        ecoPoints: user.ecoPoints,
        level: calculateLevel(user.totalPoints),
        avatar: user.avatar
      },
      rankings: {
        individual: individualRank,
        class: classRank,
        school: schoolRank
      },
      period,
      category
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics Dashboard Data
router.get('/analytics/:scope', async (req, res) => {
  try {
    const { scope } = req.params; // 'teacher', 'ngo', 'admin'
    const { userId, school, timeframe = '30' } = req.query;

    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let analytics = {};

    if (scope === 'teacher' && school) {
      // Teacher dashboard analytics
      const schoolStudents = await User.find({ school, role: 'student' });
      const studentIds = schoolStudents.map(s => s._id);

      // Total students and active students
      analytics.totalStudents = schoolStudents.length;
      analytics.activeStudents = await User.countDocuments({
        _id: { $in: studentIds },
        lastLogin: { $gte: startDate }
      });

      // Points distribution
      analytics.totalPointsAwarded = schoolStudents.reduce((sum, student) => 
        sum + student.totalPoints, 0);
      analytics.avgPointsPerStudent = Math.round(analytics.totalPointsAwarded / analytics.totalStudents);

      // Task completion stats
      const completions = await TaskCompletion.find({
        user: { $in: studentIds },
        completedAt: { $gte: startDate }
      });

      analytics.tasksCompleted = completions.length;
      analytics.pendingVerifications = await TaskCompletion.countDocuments({
        user: { $in: studentIds },
        verificationStatus: 'pending'
      });

      // Top performers
      analytics.topPerformers = schoolStudents
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 5)
        .map(student => ({
          username: student.username,
          class: student.class,
          totalPoints: student.totalPoints,
          level: calculateLevel(student.totalPoints)
        }));

      // Class breakdown
      const classStats = await User.aggregate([
        { $match: { school, role: 'student' } },
        {
          $group: {
            _id: '$class',
            studentCount: { $sum: 1 },
            totalPoints: { $sum: '$totalPoints' },
            avgPoints: { $avg: '$totalPoints' }
          }
        },
        { $sort: { totalPoints: -1 } }
      ]);

      analytics.classBreakdown = classStats.map(cls => ({
        class: cls._id,
        studentCount: cls.studentCount,
        totalPoints: cls.totalPoints,
        avgPoints: Math.round(cls.avgPoints)
      }));
    }

    res.json({
      scope,
      timeframe: `${days} days`,
      generatedAt: new Date(),
      ...analytics
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Leaderboards (Cron job endpoint)
router.post('/update', async (req, res) => {
  try {
    const periods = ['daily', 'weekly', 'monthly', 'all-time'];
    const categories = ['individual', 'class', 'school'];

    for (const period of periods) {
      for (const category of categories) {
        await updateLeaderboard(period, category);
      }
    }

    res.json({ 
      success: true, 
      message: 'All leaderboards updated successfully',
      updatedAt: new Date()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate level
function calculateLevel(totalPoints) {
  if (totalPoints < 100) return 1;
  if (totalPoints < 300) return 2;
  if (totalPoints < 600) return 3;
  if (totalPoints < 1000) return 4;
  if (totalPoints < 1500) return 5;
  return Math.floor(totalPoints / 300) + 3;
}

async function updateLeaderboard(period, category) {
  // This would contain the logic to pre-calculate and cache leaderboard data
  // For now, we'll use real-time calculation in the GET endpoints
  console.log(`Updating ${period} ${category} leaderboard...`);
}

module.exports = router;