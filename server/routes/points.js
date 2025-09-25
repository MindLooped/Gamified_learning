const express = require('express');
const router = express.Router();
const { User, TaskCompletion } = require('../models');

// Badge System Configuration
const BADGES = {
  // Beginner Badges
  FIRST_TASK: { id: 'first_task', name: 'Eco Beginner', icon: '🌱', points: 10 },
  STREAK_7: { id: 'streak_7', name: 'Weekly Warrior', icon: '🔥', points: 50 },
  STREAK_30: { id: 'streak_30', name: 'Monthly Master', icon: '⚡', points: 200 },
  
  // Category Badges
  RECYCLING_PRO: { id: 'recycling_pro', name: 'Recycling Pro', icon: '♻️', points: 100 },
  ENERGY_SAVER: { id: 'energy_saver', name: 'Energy Saver', icon: '💡', points: 100 },
  WATER_GUARDIAN: { id: 'water_guardian', name: 'Water Guardian', icon: '💧', points: 100 },
  
  // Achievement Badges
  POINT_MILESTONES: {
    100: { id: 'points_100', name: 'Century Club', icon: '💯', points: 0 },
    500: { id: 'points_500', name: 'Eco Champion', icon: '🏆', points: 0 },
    1000: { id: 'points_1000', name: 'Environmental Hero', icon: '🦸‍♀️', points: 0 },
    5000: { id: 'points_5000', name: 'Planet Savior', icon: '🌍', points: 0 }
  }
};

// Award Points
router.post('/award', async (req, res) => {
  try {
    const { userId, taskId, points, verificationData } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user points
    user.ecoPoints += points;
    user.totalPoints += points;

    // Check for new badges
    const newBadges = await checkAndAwardBadges(user);
    
    // Update streak
    updateStreak(user);
    
    // Save user
    await user.save();

    // Record task completion
    const completion = new TaskCompletion({
      user: userId,
      task: taskId,
      pointsAwarded: points,
      verificationStatus: 'verified',
      evidence: verificationData
    });
    await completion.save();

    res.json({
      success: true,
      pointsAwarded: points,
      totalPoints: user.totalPoints,
      newBadges,
      currentLevel: calculateLevel(user.totalPoints),
      streak: user.streak
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Stats
router.get('/stats/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const completedTasks = await TaskCompletion.countDocuments({ 
      user: req.params.userId, 
      verificationStatus: 'verified' 
    });

    const stats = {
      ecoPoints: user.ecoPoints,
      totalPoints: user.totalPoints,
      badges: user.badges,
      level: calculateLevel(user.totalPoints),
      streak: user.streak,
      tasksCompleted: completedTasks,
      avatar: user.avatar,
      nextLevelPoints: getNextLevelPoints(user.totalPoints)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Badge Achievement Logic
async function checkAndAwardBadges(user) {
  const newBadges = [];
  
  // Check point milestones
  Object.entries(BADGES.POINT_MILESTONES).forEach(([points, badge]) => {
    if (user.totalPoints >= parseInt(points) && !user.badges.find(b => b.id === badge.id)) {
      user.badges.push(badge);
      newBadges.push(badge);
    }
  });

  // Check streak badges
  if (user.streak >= 7 && !user.badges.find(b => b.id === BADGES.STREAK_7.id)) {
    user.badges.push(BADGES.STREAK_7);
    newBadges.push(BADGES.STREAK_7);
  }
  
  if (user.streak >= 30 && !user.badges.find(b => b.id === BADGES.STREAK_30.id)) {
    user.badges.push(BADGES.STREAK_30);
    newBadges.push(BADGES.STREAK_30);
  }

  return newBadges;
}

// Level Calculation
function calculateLevel(totalPoints) {
  if (totalPoints < 100) return 1;
  if (totalPoints < 300) return 2;
  if (totalPoints < 600) return 3;
  if (totalPoints < 1000) return 4;
  if (totalPoints < 1500) return 5;
  return Math.floor(totalPoints / 300) + 3; // Continue scaling
}

function getNextLevelPoints(currentPoints) {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelThresholds = [100, 300, 600, 1000, 1500];
  
  if (currentLevel <= 5) {
    return nextLevelThresholds[currentLevel - 1];
  }
  return (currentLevel + 1 - 3) * 300; // For levels above 5
}

// Streak Management
function updateStreak(user) {
  const today = new Date().toDateString();
  const lastLogin = user.lastLogin ? user.lastLogin.toDateString() : null;
  
  if (lastLogin === today) {
    // Already logged in today, no change
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastLogin === yesterday.toDateString()) {
    // Consecutive day, increase streak
    user.streak += 1;
  } else if (lastLogin !== today) {
    // Streak broken
    user.streak = 1;
  }
  
  user.lastLogin = new Date();
}

module.exports = router;