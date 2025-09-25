"use client";

import { useState, useEffect } from 'react';
import EcoLearnAPI from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt?: string;
}

interface UserStats {
  ecoPoints: number;
  totalPoints: number;
  badges: Badge[];
  level: number;
  streak: number;
  tasksCompleted: number;
  avatar: string;
  nextLevelPoints: number;
}

export default function PointsBadgesSystem() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const user = EcoLearnAPI.getCurrentUser();
      if (!user) return;

      const stats = await EcoLearnAPI.getUserStats(user.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      toast.error('Failed to load user statistics');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!userStats) return 0;
    const currentLevelMin = getLevelMinPoints(userStats.level);
    const nextLevelMin = userStats.nextLevelPoints;
    const currentProgress = userStats.totalPoints - currentLevelMin;
    const levelRange = nextLevelMin - currentLevelMin;
    return (currentProgress / levelRange) * 100;
  };

  const getLevelMinPoints = (level: number) => {
    const thresholds = [0, 100, 300, 600, 1000, 1500];
    if (level <= 5) return thresholds[level - 1] || 0;
    return (level - 3) * 300;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">Unable to load user statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{userStats.avatar}</span>
            <div>
              <h3 className="text-xl font-bold">Level {userStats.level}</h3>
              <p className="text-green-100">EcoLearn Champion</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
            <p className="text-green-100">Total Points</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Level {userStats.level + 1}</span>
            <span>{userStats.nextLevelPoints - userStats.totalPoints} points to go</span>
          </div>
          <div className="w-full bg-green-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold">{userStats.ecoPoints}</div>
            <div className="text-xs text-green-100">Eco Points</div>
          </div>
          <div>
            <div className="text-lg font-bold">{userStats.streak}</div>
            <div className="text-xs text-green-100">Day Streak 🔥</div>
          </div>
          <div>
            <div className="text-lg font-bold">{userStats.tasksCompleted}</div>
            <div className="text-xs text-green-100">Tasks Done</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            🏆 Badges ({userStats.badges.length})
          </h3>
          <button
            onClick={() => setShowBadges(!showBadges)}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            {showBadges ? 'Hide' : 'Show All'}
          </button>
        </div>

        <div className={`grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 ${!showBadges && 'max-h-24 overflow-hidden'}`}>
          {userStats.badges.map((badge, index) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-3 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
              title={`${badge.name} - Earned ${badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'recently'}`}
            >
              <span className="text-2xl mb-1">{badge.icon}</span>
              <span className="text-xs text-center font-medium text-gray-700 leading-tight">
                {badge.name}
              </span>
            </div>
          ))}
          
          {/* Placeholder for next badge */}
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <span className="text-2xl mb-1 text-gray-300">🔒</span>
            <span className="text-xs text-center text-gray-400">
              Next Badge
            </span>
          </div>
        </div>
      </div>

      {/* Achievement Milestones */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Upcoming Milestones</h3>
        <div className="space-y-3">
          {getUpcomingMilestones(userStats.totalPoints).map((milestone, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{milestone.icon}</span>
                <div>
                  <p className="font-medium text-gray-800">{milestone.name}</p>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{milestone.points} pts</p>
                <p className="text-xs text-gray-500">
                  {milestone.points - userStats.totalPoints} to go
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get upcoming milestones
function getUpcomingMilestones(currentPoints: number) {
  const allMilestones = [
    { points: 100, name: 'Century Club', icon: '💯', description: 'Join the 100-point club' },
    { points: 500, name: 'Eco Champion', icon: '🏆', description: 'Become an environmental champion' },
    { points: 1000, name: 'Environmental Hero', icon: '🦸‍♀️', description: 'Achieve hero status' },
    { points: 2500, name: 'Planet Guardian', icon: '🌍', description: 'Guard our planet' },
    { points: 5000, name: 'Earth Savior', icon: '🌟', description: 'Ultimate environmental achievement' },
  ];
  
  return allMilestones
    .filter(milestone => milestone.points > currentPoints)
    .slice(0, 3); // Show next 3 milestones
}