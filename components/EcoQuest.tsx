"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "@/components/Confetti";
import { AchievementSystem } from "@/components/AchievementSystem";
import { TeamCollaboration } from "@/components/TeamCollaboration";
import { 
  AnimatedProgress, 
  FloatingPoints, 
  BadgeUnlockAnimation, 
  StreakCounter,
  ImpactVisualization 
} from "@/components/EcoQuestAnimations";

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  coins: number;
  category: "trees" | "cleanup" | "transport" | "water" | "energy" | "waste";
  difficulty: "easy" | "medium" | "hard";
  emoji: string;
  timeLimit?: number; // in days
  requiredProof: "photo" | "video" | "both";
}

interface UserProgress {
  totalPoints: number;
  totalCoins: number;
  badges: Badge[];
  level: number;
  completedTasks: string[];
  currentStreak: number;
  treesPlanted: number;
  plasticCleaned: number; // in kg
  co2Saved: number; // in kg
  waterSaved: number; // in liters
}

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  requirement: number;
  category: string;
}

const ecoTasks: Task[] = [
  {
    id: "plant-tree",
    title: "Plant a Tree 🌱",
    description: "Plant a tree or sapling and upload a photo of yourself with it",
    points: 50,
    coins: 25,
    category: "trees",
    difficulty: "medium",
    emoji: "🌳",
    timeLimit: 7,
    requiredProof: "photo"
  },
  {
    id: "plastic-cleanup",
    title: "Plastic Beach Cleanup 🏖️",
    description: "Clean up plastic waste from a beach, park, or public area (min 1kg)",
    points: 40,
    coins: 20,
    category: "cleanup",
    difficulty: "medium",
    emoji: "🗑️",
    requiredProof: "both"
  },
  {
    id: "cycle-commute",
    title: "Bike to School/Work 🚲",
    description: "Use bicycle instead of car/motorcycle for a week",
    points: 30,
    coins: 15,
    category: "transport",
    difficulty: "easy",
    emoji: "🚲",
    timeLimit: 7,
    requiredProof: "photo"
  },
  {
    id: "water-conservation",
    title: "Water Conservation Challenge 💧",
    description: "Install water-saving devices or demonstrate water conservation methods",
    points: 35,
    coins: 18,
    category: "water",
    difficulty: "medium",
    emoji: "💧",
    requiredProof: "video"
  },
  {
    id: "solar-energy",
    title: "Solar Power Project ☀️",
    description: "Set up a small solar panel or solar cooker demonstration",
    points: 60,
    coins: 30,
    category: "energy",
    difficulty: "hard",
    emoji: "☀️",
    requiredProof: "video"
  },
  {
    id: "composting",
    title: "Start Composting 🌿",
    description: "Create a compost bin and maintain it for 2 weeks",
    points: 45,
    coins: 22,
    category: "waste",
    difficulty: "medium",
    emoji: "🌿",
    timeLimit: 14,
    requiredProof: "both"
  },
  {
    id: "community-garden",
    title: "Community Garden 🌻",
    description: "Start or participate in a community garden project",
    points: 70,
    coins: 35,
    category: "trees",
    difficulty: "hard",
    emoji: "🌻",
    timeLimit: 30,
    requiredProof: "video"
  },
  {
    id: "reusable-campaign",
    title: "Reusable Items Campaign 🛍️",
    description: "Promote reusable bags, bottles, and containers in your community",
    points: 25,
    coins: 12,
    category: "waste",
    difficulty: "easy",
    emoji: "🛍️",
    requiredProof: "photo"
  }
];

const ecoBadges: Badge[] = [
  {
    id: "tree-hugger",
    name: "Tree Hugger 🌳",
    description: "Plant 5 trees",
    emoji: "🌳",
    unlocked: false,
    requirement: 5,
    category: "trees"
  },
  {
    id: "cleanup-hero",
    name: "Cleanup Hero 🦸‍♀️",
    description: "Clean 50kg of plastic waste",
    emoji: "🦸‍♀️",
    unlocked: false,
    requirement: 50,
    category: "cleanup"
  },
  {
    id: "eco-warrior",
    name: "Eco Warrior ⚔️",
    description: "Complete 10 eco tasks",
    emoji: "⚔️",
    unlocked: false,
    requirement: 10,
    category: "general"
  },
  {
    id: "carbon-saver",
    name: "Carbon Saver 🌍",
    description: "Save 100kg of CO2",
    emoji: "🌍",
    unlocked: false,
    requirement: 100,
    category: "transport"
  },
  {
    id: "water-guardian",
    name: "Water Guardian 💧",
    description: "Save 1000L of water",
    emoji: "💧",
    unlocked: false,
    requirement: 1000,
    category: "water"
  }
];

export default function EcoQuest() {
  const [activeTab, setActiveTab] = useState<"tasks" | "progress" | "leaderboard" | "badges" | "achievements" | "teams">("tasks");
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    totalCoins: 0,
    badges: ecoBadges,
    level: 1,
    completedTasks: [],
    currentStreak: 0,
    treesPlanted: 0,
    plasticCleaned: 0,
    co2Saved: 0,
    waterSaved: 0
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showFloatingPoints, setShowFloatingPoints] = useState(false);
  const [floatingPointsValue, setFloatingPointsValue] = useState(0);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

  // Load user progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ecoquest_progress");
    if (saved) {
      try {
        setUserProgress(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("ecoquest_progress", JSON.stringify(userProgress));
  }, [userProgress]);

  // Auto-hide confetti after 3 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const calculateLevel = (points: number) => Math.floor(points / 100) + 1;

  const handleTaskComplete = (task: Task) => {
    if (!uploadedFile) {
      toast.error("Please upload proof before completing the task!");
      return;
    }

    const newPoints = userProgress.totalPoints + task.points;
    const newCoins = userProgress.totalCoins + task.coins;
    const newLevel = calculateLevel(newPoints);
    const levelUp = newLevel > userProgress.level;

    // Update progress based on task category
    let updatedProgress = { ...userProgress };
    switch (task.category) {
      case "trees":
        updatedProgress.treesPlanted += 1;
        break;
      case "cleanup":
        updatedProgress.plasticCleaned += 5; // Assume 5kg per cleanup
        break;
      case "transport":
        updatedProgress.co2Saved += 10; // Assume 10kg CO2 saved
        break;
      case "water":
        updatedProgress.waterSaved += 100; // Assume 100L saved
        break;
    }

    setUserProgress({
      ...updatedProgress,
      totalPoints: newPoints,
      totalCoins: newCoins,
      level: newLevel,
      completedTasks: [...userProgress.completedTasks, task.id],
      currentStreak: userProgress.currentStreak + 1
    });

    // Check for new badges
    checkBadges(updatedProgress);

    // Show floating points animation
    setFloatingPointsValue(task.points);
    setShowFloatingPoints(true);

    // Show floating points animation
    setFloatingPointsValue(task.points);
    setShowFloatingPoints(true);

    if (levelUp) {
      setShowConfetti(true);
      toast.success(`🎉 Level Up! You're now level ${newLevel}!`, { duration: 4000 });
    } else {
      toast.success(`✅ Task completed! +${task.points} points, +${task.coins} coins!`);
    }

    setShowTaskModal(false);
    setSelectedTask(null);
    setUploadedFile(null);
  };

  const checkBadges = (progress: UserProgress) => {
    const updatedBadges = progress.badges.map(badge => {
      if (!badge.unlocked) {
        let requirementMet = false;
        switch (badge.category) {
          case "trees":
            requirementMet = progress.treesPlanted >= badge.requirement;
            break;
          case "cleanup":
            requirementMet = progress.plasticCleaned >= badge.requirement;
            break;
          case "general":
            requirementMet = progress.completedTasks.length >= badge.requirement;
            break;
          case "transport":
            requirementMet = progress.co2Saved >= badge.requirement;
            break;
          case "water":
            requirementMet = progress.waterSaved >= badge.requirement;
            break;
        }

        if (requirementMet) {
          toast.success(`🏆 Badge Unlocked: ${badge.name}!`, { duration: 5000 });
          setUnlockedBadge(badge);
          setShowBadgeAnimation(true);
          return { ...badge, unlocked: true };
        }
      }
      return badge;
    });

    setUserProgress(prev => ({ ...prev, badges: updatedBadges }));
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const isCompleted = userProgress.completedTasks.includes(task.id);
    const difficultyColor = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800", 
      hard: "bg-red-100 text-red-800"
    };

    return (
      <Card className={`transition-all duration-300 hover:shadow-lg ${isCompleted ? 'opacity-50' : 'hover:scale-105'}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="text-4xl mb-2">{task.emoji}</div>
            <Badge className={difficultyColor[task.difficulty]}>
              {task.difficulty.toUpperCase()}
            </Badge>
          </div>
          <CardTitle className="text-lg">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm">{task.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-orange-600">⭐ {task.points} points</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">🪙 {task.coins} coins</span>
              </div>
            </div>
            
            {task.timeLimit && (
              <Badge variant="outline">
                📅 {task.timeLimit} days
              </Badge>
            )}
          </div>

          <Button
            onClick={() => {
              setSelectedTask(task);
              setShowTaskModal(true);
            }}
            disabled={isCompleted}
            className={`w-full ${isCompleted 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            }`}
          >
            {isCompleted ? '✅ Completed' : '🚀 Start Task'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const ProgressStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl mb-2">🌳</div>
          <div className="text-2xl font-bold text-green-700">{userProgress.treesPlanted}</div>
          <div className="text-sm text-green-600">Trees Planted</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl mb-2">♻️</div>
          <div className="text-2xl font-bold text-blue-700">{userProgress.plasticCleaned}kg</div>
          <div className="text-sm text-blue-600">Plastic Cleaned</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-2xl font-bold text-purple-700">{userProgress.co2Saved}kg</div>
          <div className="text-sm text-purple-600">CO₂ Saved</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl mb-2">💧</div>
          <div className="text-2xl font-bold text-teal-700">{userProgress.waterSaved}L</div>
          <div className="text-sm text-teal-600">Water Saved</div>
        </CardContent>
      </Card>
    </div>
  );

  const LeaderboardEntry = ({ rank, name, points, avatar }: { rank: number, name: string, points: number, avatar: string }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className={`text-2xl font-bold ${rank <= 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
      </div>
      <div className="text-2xl">{avatar}</div>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-600">{points} points</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Toaster position="top-center" />
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">🌍 EcoQuest</h1>
              <p className="text-green-100">Make a real difference for our planet!</p>
            </div>
            <Link href="/Home">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                🏠 Home
              </Button>
            </Link>
          </div>
          
          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">Level {userProgress.level}</div>
              <div className="text-sm opacity-80">Current Level</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{userProgress.totalPoints}</div>
              <div className="text-sm opacity-80">Total Points</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{userProgress.totalCoins}</div>
              <div className="text-sm opacity-80">Eco Coins</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{userProgress.currentStreak}</div>
              <div className="text-sm opacity-80">Day Streak</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {userProgress.level}</span>
              <span>Level {userProgress.level + 1}</span>
            </div>
            <Progress 
              value={((userProgress.totalPoints % 100) / 100) * 100} 
              className="h-3 bg-white/20"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {[
              { id: "tasks", label: "🎯 Tasks", emoji: "🎯" },
              { id: "progress", label: "📊 Progress", emoji: "📊" },
              { id: "badges", label: "🏆 Badges", emoji: "🏆" },
              { id: "achievements", label: "🏅 Achievements", emoji: "🏅" },
              { id: "teams", label: "👥 Teams", emoji: "👥" },
              { id: "leaderboard", label: "🥇 Leaderboard", emoji: "🥇" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-600 hover:text-green-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === "tasks" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">🎯 Available Eco Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecoTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">📊 Your Eco Impact</h2>
            
            {/* Animated Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedProgress 
                value={userProgress.treesPlanted} 
                max={20} 
                label="Trees Planted" 
                color="#16a34a" 
                emoji="🌳" 
              />
              <AnimatedProgress 
                value={userProgress.plasticCleaned} 
                max={100} 
                label="Plastic Cleaned (kg)" 
                color="#2563eb" 
                emoji="♻️" 
              />
              <AnimatedProgress 
                value={userProgress.co2Saved} 
                max={200} 
                label="CO₂ Saved (kg)" 
                color="#7c3aed" 
                emoji="🌍" 
              />
              <AnimatedProgress 
                value={userProgress.waterSaved} 
                max={1000} 
                label="Water Saved (L)" 
                color="#0891b2" 
                emoji="💧" 
              />
            </div>

            {/* Streak Counter */}
            <StreakCounter 
              streak={userProgress.currentStreak} 
              maxStreak={Math.max(userProgress.currentStreak, 0)} 
            />

            {/* Impact Visualization */}
            <div>
              <h3 className="text-xl font-bold mb-4">🌍 Real-World Impact</h3>
              <ImpactVisualization 
                treesPlanted={userProgress.treesPlanted}
                plasticCleaned={userProgress.plasticCleaned}
                co2Saved={userProgress.co2Saved}
                waterSaved={userProgress.waterSaved}
              />
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">🏆 Eco Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProgress.badges.map((badge) => (
                <Card key={badge.id} className={`${badge.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'opacity-60'}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{badge.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                    <Badge variant={badge.unlocked ? "default" : "outline"}>
                      {badge.unlocked ? "Unlocked! 🎉" : `0/${badge.requirement}`}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">🏅 Global Leaderboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>🌟 Top EcoQuesters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <LeaderboardEntry rank={1} name="Sarah Green 🌱" points={1250} avatar="👩‍🌾" />
                    <LeaderboardEntry rank={2} name="Alex Forest 🌲" points={1180} avatar="👨‍🔬" />
                    <LeaderboardEntry rank={3} name="Maya Ocean 🌊" points={1050} avatar="👩‍🎓" />
                    <LeaderboardEntry rank={4} name="You! 🌍" points={userProgress.totalPoints} avatar="🙋‍♀️" />
                    <LeaderboardEntry rank={5} name="Tom Rivers 🏞️" points={890} avatar="👨‍🌾" />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>🏫 School Rankings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="font-semibold">🥇 Green Valley High</div>
                      <div className="text-sm text-gray-600">12,450 points</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                      <div className="font-semibold">🥈 Eco Tech College</div>
                      <div className="text-sm text-gray-600">11,230 points</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="font-semibold">🥉 Nature Academy</div>
                      <div className="text-sm text-gray-600">10,890 points</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div>
            <AchievementSystem 
              userStats={{
                trees: userProgress.treesPlanted,
                plastic: userProgress.plasticCleaned,
                co2: userProgress.co2Saved,
                water: userProgress.waterSaved,
                streak: userProgress.currentStreak,
                tasks: userProgress.completedTasks.length,
                points: userProgress.totalPoints
              }}
              onAchievementUnlocked={(achievement) => {
                toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
                setShowConfetti(true);
              }}
            />
          </div>
        )}

        {activeTab === "teams" && (
          <div>
            <TeamCollaboration 
              currentUser={{
                id: 'current_user',
                name: 'You',
                avatar: '🙋‍♀️',
                points: userProgress.totalPoints,
                level: userProgress.level,
                tasksCompleted: userProgress.completedTasks.length,
                joinedAt: new Date(),
                role: 'member',
                achievements: userProgress.badges.filter(b => b.unlocked).map(b => b.id)
              }}
            />
          </div>
        )}
      </div>

      {/* Task Completion Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{selectedTask.emoji}</span>
                <span>{selectedTask.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{selectedTask.description}</p>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium mb-2">📋 Requirements:</div>
                <ul className="text-sm space-y-1">
                  <li>• Upload {selectedTask.requiredProof} as proof</li>
                  {selectedTask.timeLimit && <li>• Complete within {selectedTask.timeLimit} days</li>}
                  <li>• Follow all safety guidelines</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  📸 Upload Proof ({selectedTask.requiredProof})
                </label>
                <input
                  type="file"
                  accept={selectedTask.requiredProof === "video" ? "video/*" : selectedTask.requiredProof === "photo" ? "image/*" : "image/*,video/*"}
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleTaskComplete(selectedTask)}
                  disabled={!uploadedFile}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ✅ Complete Task
                </Button>
                <Button
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedTask(null);
                    setUploadedFile(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  ❌ Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Points Animation */}
      <FloatingPoints 
        points={floatingPointsValue}
        show={showFloatingPoints}
        onComplete={() => setShowFloatingPoints(false)}
      />

      {/* Badge Unlock Animation */}
      {unlockedBadge && (
        <BadgeUnlockAnimation 
          badge={{
            name: unlockedBadge.name,
            emoji: unlockedBadge.emoji,
            description: unlockedBadge.description
          }}
          show={showBadgeAnimation}
          onComplete={() => {
            setShowBadgeAnimation(false);
            setUnlockedBadge(null);
          }}
        />
      )}

      {/* Confetti */}
      {showConfetti && <Confetti />}
      
      <Toaster position="top-center" />
    </div>
  );
}