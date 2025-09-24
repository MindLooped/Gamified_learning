"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'environmental' | 'social' | 'educational' | 'special';
  requirements: {
    type: 'trees' | 'plastic' | 'co2' | 'water' | 'streak' | 'tasks' | 'points' | 'special';
    target: number;
  };
  reward: {
    points: number;
    badge: boolean;
    title?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserAchievement extends Achievement {
  unlockedAt: Date;
  progress: number;
}

const ACHIEVEMENTS: Achievement[] = [
  // Environmental Achievements
  {
    id: 'first_tree',
    name: 'Seedling Supporter',
    description: 'Plant your first tree',
    emoji: '🌱',
    category: 'environmental',
    requirements: { type: 'trees', target: 1 },
    reward: { points: 100, badge: true },
    rarity: 'common'
  },
  {
    id: 'forest_guardian',
    name: 'Forest Guardian',
    description: 'Plant 50 trees',
    emoji: '🌲',
    category: 'environmental',
    requirements: { type: 'trees', target: 50 },
    reward: { points: 1000, badge: true, title: 'Guardian' },
    rarity: 'epic'
  },
  {
    id: 'reforestation_hero',
    name: 'Reforestation Hero',
    description: 'Plant 100 trees - you\'re creating forests!',
    emoji: '🏞️',
    category: 'environmental',
    requirements: { type: 'trees', target: 100 },
    reward: { points: 2500, badge: true, title: 'Hero' },
    rarity: 'legendary'
  },

  // Plastic Cleanup Achievements
  {
    id: 'cleanup_starter',
    name: 'Cleanup Starter',
    description: 'Clean up your first kilogram of plastic',
    emoji: '♻️',
    category: 'environmental',
    requirements: { type: 'plastic', target: 1 },
    reward: { points: 50, badge: true },
    rarity: 'common'
  },
  {
    id: 'ocean_savior',
    name: 'Ocean Savior',
    description: 'Clean up 25kg of plastic waste',
    emoji: '🌊',
    category: 'environmental',
    requirements: { type: 'plastic', target: 25 },
    reward: { points: 750, badge: true },
    rarity: 'rare'
  },
  {
    id: 'plastic_terminator',
    name: 'Plastic Terminator',
    description: 'Clean up 100kg of plastic - ocean champion!',
    emoji: '🦈',
    category: 'environmental',
    requirements: { type: 'plastic', target: 100 },
    reward: { points: 2000, badge: true, title: 'Terminator' },
    rarity: 'legendary'
  },

  // Carbon Reduction Achievements
  {
    id: 'carbon_warrior',
    name: 'Carbon Warrior',
    description: 'Save 50kg of CO₂',
    emoji: '⚡',
    category: 'environmental',
    requirements: { type: 'co2', target: 50 },
    reward: { points: 500, badge: true },
    rarity: 'rare'
  },
  {
    id: 'climate_champion',
    name: 'Climate Champion',
    description: 'Save 200kg of CO₂ emissions',
    emoji: '🌡️',
    category: 'environmental',
    requirements: { type: 'co2', target: 200 },
    reward: { points: 1500, badge: true, title: 'Champion' },
    rarity: 'epic'
  },

  // Water Conservation Achievements
  {
    id: 'water_saver',
    name: 'Water Saver',
    description: 'Save 100 liters of water',
    emoji: '💧',
    category: 'environmental',
    requirements: { type: 'water', target: 100 },
    reward: { points: 300, badge: true },
    rarity: 'common'
  },
  {
    id: 'aqua_guardian',
    name: 'Aqua Guardian',
    description: 'Save 1000 liters of water',
    emoji: '🏔️',
    category: 'environmental',
    requirements: { type: 'water', target: 1000 },
    reward: { points: 1200, badge: true },
    rarity: 'epic'
  },

  // Streak Achievements
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Maintain a 7-day streak',
    emoji: '👑',
    category: 'social',
    requirements: { type: 'streak', target: 7 },
    reward: { points: 400, badge: true },
    rarity: 'rare'
  },
  {
    id: 'unstoppable_force',
    name: 'Unstoppable Force',
    description: 'Maintain a 30-day streak',
    emoji: '🚀',
    category: 'social',
    requirements: { type: 'streak', target: 30 },
    reward: { points: 1500, badge: true, title: 'Unstoppable' },
    rarity: 'legendary'
  },

  // Task Completion Achievements
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Complete 25 eco tasks',
    emoji: '✅',
    category: 'educational',
    requirements: { type: 'tasks', target: 25 },
    reward: { points: 800, badge: true },
    rarity: 'rare'
  },
  {
    id: 'eco_scholar',
    name: 'Eco Scholar',
    description: 'Complete 100 eco tasks',
    emoji: '🎓',
    category: 'educational',
    requirements: { type: 'tasks', target: 100 },
    reward: { points: 2000, badge: true, title: 'Scholar' },
    rarity: 'epic'
  },

  // Points Achievements
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Earn 1000 total points',
    emoji: '💎',
    category: 'special',
    requirements: { type: 'points', target: 1000 },
    reward: { points: 200, badge: true },
    rarity: 'common'
  },
  {
    id: 'eco_millionaire',
    name: 'Eco Millionaire',
    description: 'Earn 10,000 total points',
    emoji: '💰',
    category: 'special',
    requirements: { type: 'points', target: 10000 },
    reward: { points: 1000, badge: true, title: 'Millionaire' },
    rarity: 'legendary'
  },

  // Special Achievements
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Join the EcoQuest community',
    emoji: '🌟',
    category: 'special',
    requirements: { type: 'special', target: 1 },
    reward: { points: 100, badge: true },
    rarity: 'common'
  },
  {
    id: 'community_builder',
    name: 'Community Builder',
    description: 'Inspire others to join the cause',
    emoji: '🤝',
    category: 'special',
    requirements: { type: 'special', target: 1 },
    reward: { points: 500, badge: true },
    rarity: 'rare'
  }
];

interface AchievementSystemProps {
  userStats: {
    trees: number;
    plastic: number;
    co2: number;
    water: number;
    streak: number;
    tasks: number;
    points: number;
  };
  onAchievementUnlocked: (achievement: Achievement) => void;
}

export const AchievementSystem = ({ userStats, onAchievementUnlocked }: AchievementSystemProps) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const savedAchievements = localStorage.getItem('ecoquest-achievements');
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  useEffect(() => {
    checkForNewAchievements();
  }, [userStats]);

  const checkForNewAchievements = () => {
    const newUnlocked: UserAchievement[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      const isAlreadyUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id);
      if (isAlreadyUnlocked) return;

      let currentValue = 0;
      switch (achievement.requirements.type) {
        case 'trees': currentValue = userStats.trees; break;
        case 'plastic': currentValue = userStats.plastic; break;
        case 'co2': currentValue = userStats.co2; break;
        case 'water': currentValue = userStats.water; break;
        case 'streak': currentValue = userStats.streak; break;
        case 'tasks': currentValue = userStats.tasks; break;
        case 'points': currentValue = userStats.points; break;
        case 'special': currentValue = 1; break;
      }

      if (currentValue >= achievement.requirements.target) {
        const userAchievement: UserAchievement = {
          ...achievement,
          unlockedAt: new Date(),
          progress: 100
        };
        newUnlocked.push(userAchievement);
        onAchievementUnlocked(achievement);
      }
    });

    if (newUnlocked.length > 0) {
      const updatedAchievements = [...unlockedAchievements, ...newUnlocked];
      setUnlockedAchievements(updatedAchievements);
      localStorage.setItem('ecoquest-achievements', JSON.stringify(updatedAchievements));
    }
  };

  const getAchievementProgress = (achievement: Achievement) => {
    let currentValue = 0;
    switch (achievement.requirements.type) {
      case 'trees': currentValue = userStats.trees; break;
      case 'plastic': currentValue = userStats.plastic; break;
      case 'co2': currentValue = userStats.co2; break;
      case 'water': currentValue = userStats.water; break;
      case 'streak': currentValue = userStats.streak; break;
      case 'tasks': currentValue = userStats.tasks; break;
      case 'points': currentValue = userStats.points; break;
      case 'special': currentValue = 1; break;
    }

    return Math.min((currentValue / achievement.requirements.target) * 100, 100);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environmental': return '🌍';
      case 'social': return '👥';
      case 'educational': return '📚';
      case 'special': return '⭐';
      default: return '🏆';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? ACHIEVEMENTS 
    : ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'environmental', name: 'Environmental', icon: '🌍' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'educational', name: 'Educational', icon: '📚' },
    { id: 'special', name: 'Special', icon: '⭐' }
  ];

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🏆 Achievement Hall
        </h2>
        <p className="text-gray-600">
          {unlockedCount}/{totalCount} achievements unlocked ({((unlockedCount/totalCount) * 100).toFixed(1)}%)
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center space-x-1"
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id);
          const progress = getAchievementProgress(achievement);
          
          return (
            <Card 
              key={achievement.id}
              className={`transition-all duration-300 hover:scale-105 ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-lg' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.emoji}
                    </span>
                    <div>
                      <CardTitle className={`text-lg ${isUnlocked ? 'text-green-800' : 'text-gray-500'}`}>
                        {achievement.name}
                      </CardTitle>
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-lg">
                    {getCategoryIcon(achievement.category)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                
                {!isUnlocked && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                    +{achievement.reward.points} points
                  </span>
                  {isUnlocked && (
                    <span className="text-green-600 font-medium">✅ Unlocked</span>
                  )}
                </div>
                
                {achievement.reward.title && isUnlocked && (
                  <div className="mt-2 text-center">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Title: "{achievement.reward.title}"
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">🎯 Achievement Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map(category => {
              const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category.id);
              const categoryUnlocked = unlockedAchievements.filter(ua => ua.category === category.id);
              
              return (
                <div key={category.id} className="text-center">
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="font-semibold text-gray-800">
                    {categoryUnlocked.length}/{categoryAchievements.length}
                  </div>
                  <div className="text-xs text-gray-600">{category.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};