"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

interface EnvironmentalHazard {
  id: string;
  name: string;
  x: number; // Percentage position
  y: number; // Percentage position
  width: number;
  height: number;
  ecoFact: string;
  points: number;
  found: boolean;
}

interface GameScene {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hazards: EnvironmentalHazard[];
  timeLimit: number; // in seconds
  level: number;
}

interface DetectiveBadge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: number;
  type: 'hazards' | 'points' | 'levels' | 'speed' | 'accuracy';
  unlocked: boolean;
}

interface GameStats {
  totalPoints: number;
  hazardsFound: number;
  levelsCompleted: number;
  gamesPlayed: number;
  averageAccuracy: number;
  fastestCompletion: number;
  badges: DetectiveBadge[];
}

const gameScenes: GameScene[] = [
  // Level 1 - Easy (Park Scene)
  {
    id: "park_scene",
    name: "City Park Investigation",
    description: "Find environmental hazards in this beautiful park",
    backgroundImage: "park",
    difficulty: "easy",
    level: 1,
    timeLimit: 90,
    hazards: [
      {
        id: "overflowing_bin",
        name: "Overflowing Trash Bin",
        x: 28, y: 45, width: 8, height: 12,
        ecoFact: "Overflowing bins attract pests and can spread litter. Proper waste management prevents 80% of urban pollution!",
        points: 100,
        found: false
      },
      {
        id: "cigarette_butts",
        name: "Cigarette Butts",
        x: 47, y: 62, width: 6, height: 8,
        ecoFact: "Cigarette butts are the most littered item globally. They take 10-12 years to decompose and contaminate soil and water!",
        points: 80,
        found: false
      },
      {
        id: "plastic_bottle",
        name: "Discarded Plastic Bottle",
        x: 68, y: 58, width: 4, height: 8,
        ecoFact: "A single plastic bottle takes 450 years to decompose. Recycling one bottle saves enough energy to power a light bulb for 6 hours!",
        points: 90,
        found: false
      },
      {
        id: "dog_waste",
        name: "Pet Waste",
        x: 24, y: 63, width: 4, height: 3,
        ecoFact: "Pet waste contains harmful bacteria that can contaminate water sources. Always clean up after your pets!",
        points: 70,
        found: false
      }
    ]
  },

  // Level 2 - Medium (Beach Scene)
  {
    id: "beach_scene",
    name: "Coastal Beach Cleanup",
    description: "Identify pollution threats to marine life",
    backgroundImage: "beach",
    difficulty: "medium",
    level: 2,
    timeLimit: 120,
    hazards: [
      {
        id: "plastic_bags",
        name: "Floating Plastic Bags",
        x: 37, y: 42, width: 8, height: 6,
        ecoFact: "Marine animals mistake plastic bags for jellyfish. Over 1 million marine animals die annually from plastic pollution!",
        points: 120,
        found: false
      },
      {
        id: "oil_spill",
        name: "Oil Contamination",
        x: 70, y: 47, width: 12, height: 8,
        ecoFact: "Oil spills coat bird feathers, destroying their insulation. Just 1 liter of oil can contaminate 1 million liters of water!",
        points: 150,
        found: false
      },
      {
        id: "fishing_net",
        name: "Abandoned Fishing Net",
        x: 18, y: 53, width: 15, height: 6,
        ecoFact: "Ghost fishing nets continue catching marine life for decades. They're responsible for 10% of ocean plastic pollution!",
        points: 130,
        found: false
      },
      {
        id: "chemical_barrels",
        name: "Toxic Chemical Waste",
        x: 80, y: 60, width: 6, height: 10,
        ecoFact: "Chemical waste can persist in the environment for centuries, affecting entire food chains!",
        points: 140,
        found: false
      },
      {
        id: "beach_litter",
        name: "Beach Litter",
        x: 25, y: 64, width: 8, height: 6,
        ecoFact: "Beach litter breaks down into microplastics that enter the food chain, affecting both wildlife and humans!",
        points: 110,
        found: false
      }
    ]
  },

  // Level 3 - Hard (Urban Street Scene)
  {
    id: "urban_scene",
    name: "Urban Environment Analysis",
    description: "Detect complex environmental issues in the city",
    backgroundImage: "urban",
    difficulty: "hard",
    level: 3,
    timeLimit: 180,
    hazards: [
      {
        id: "factory_emissions",
        name: "Industrial Emissions",
        x: 90, y: 8, width: 12, height: 15,
        ecoFact: "Industrial emissions are responsible for 21% of global greenhouse gases. They contribute to climate change and respiratory diseases!",
        points: 180,
        found: false
      },
      {
        id: "car_exhaust",
        name: "Vehicle Exhaust Pollution",
        x: 34, y: 39, width: 8, height: 4,
        ecoFact: "Transportation accounts for 24% of global CO₂ emissions. Electric vehicles can reduce this by up to 70%!",
        points: 160,
        found: false
      },
      {
        id: "storm_drain_pollution",
        name: "Contaminated Storm Drain",
        x: 17, y: 47, width: 6, height: 6,
        ecoFact: "Storm drains lead directly to waterways. Pollution here can contaminate entire ecosystems downstream!",
        points: 170,
        found: false
      },
      {
        id: "chemical_leak",
        name: "Chemical Spill from Truck",
        x: 53, y: 42, width: 6, height: 4,
        ecoFact: "Chemical spills can contaminate soil and groundwater for decades. Proper hazmat protocols prevent 90% of environmental damage!",
        points: 200,
        found: false
      },
      {
        id: "light_pollution",
        name: "Broken Energy-Wasting Light",
        x: 75, y: 28, width: 4, height: 15,
        ecoFact: "Light pollution affects wildlife migration and wastes 30% of outdoor lighting energy. LED lights can reduce this impact by 50%!",
        points: 150,
        found: false
      },
      {
        id: "air_quality",
        name: "Visible Air Pollution",
        x: 35, y: 33, width: 15, height: 8,
        ecoFact: "Poor air quality causes 7 million deaths annually. Reducing emissions by 50% could prevent 80% of pollution-related diseases!",
        points: 190,
        found: false
      }
    ]
  }
];

const defaultBadges: DetectiveBadge[] = [
  {
    id: "plastic_buster",
    name: "Plastic Buster",
    description: "Find 5 plastic pollution hazards",
    emoji: "♻️",
    requirement: 5,
    type: "hazards",
    unlocked: false
  },
  {
    id: "air_quality_hero",
    name: "Air Quality Hero", 
    description: "Identify all air pollution sources",
    emoji: "💨",
    requirement: 3,
    type: "hazards",
    unlocked: false
  },
  {
    id: "water_guardian",
    name: "Water Guardian",
    description: "Protect water sources by finding contamination",
    emoji: "💧",
    requirement: 4,
    type: "hazards",
    unlocked: false
  },
  {
    id: "speed_detective",
    name: "Speed Detective",
    description: "Complete a level in under 60 seconds",
    emoji: "⚡",
    requirement: 60,
    type: "speed",
    unlocked: false
  },
  {
    id: "master_detective",
    name: "Master Detective",
    description: "Complete all 3 levels",
    emoji: "🕵️",
    requirement: 3,
    type: "levels",
    unlocked: false
  },
  {
    id: "eagle_eye",
    name: "Eagle Eye",
    description: "Achieve 100% accuracy in a level",
    emoji: "👁️",
    requirement: 100,
    type: "accuracy",
    unlocked: false
  }
];

interface EcoDetectiveProps {
  onBack: () => void;
  onPointsEarned: (points: number) => void;
}

export const EcoDetective = ({ onBack, onPointsEarned }: EcoDetectiveProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [foundHazards, setFoundHazards] = useState<Set<string>>(new Set());
  const [clickedWrong, setClickedWrong] = useState<{x: number, y: number} | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPoints: 0,
    hazardsFound: 0,
    levelsCompleted: 0,
    gamesPlayed: 0,
    averageAccuracy: 0,
    fastestCompletion: 0,
    badges: defaultBadges
  });
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [showHint, setShowHint] = useState<{show: boolean, hazard: EnvironmentalHazard | null}>({
    show: false,
    hazard: null
  });
  const [showHazardOutlines, setShowHazardOutlines] = useState(false);

  const currentScene = gameScenes.find(scene => scene.level === currentLevel) || gameScenes[0];

  const renderSceneBackground = (sceneType: string) => {
    switch (sceneType) {
      case "park":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-sky-300 to-green-300 overflow-hidden">
            {/* Sky and Ground */}
            <div className="absolute bottom-0 w-full h-1/2 bg-green-400"></div>
            {/* Trees */}
            <div className="absolute bottom-1/3 left-12 w-20 h-20 bg-green-600 rounded-full"></div>
            <div className="absolute bottom-1/4 left-16 w-4 h-24 bg-amber-800"></div>
            <div className="absolute bottom-1/3 right-16 w-24 h-24 bg-green-600 rounded-full"></div>
            <div className="absolute bottom-1/4 right-20 w-6 h-28 bg-amber-800"></div>
            {/* Path */}
            <div className="absolute bottom-1/4 left-1/3 w-48 h-12 bg-gray-400 rounded-lg"></div>
            {/* Bench */}
            <div className="absolute bottom-1/3 left-1/2 w-24 h-8 bg-amber-700 rounded transform -translate-x-1/2"></div>
            {/* Sun */}
            <div className="absolute top-16 right-20 w-16 h-16 bg-yellow-400 rounded-full"></div>
            {/* Clouds */}
            <div className="absolute top-12 left-48 w-20 h-10 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-16 right-48 w-24 h-12 bg-white rounded-full opacity-80"></div>
            {/* Visible Hazards - Made more prominent */}
            <div className="absolute bottom-1/4 left-1/4 w-8 h-12 bg-gray-800 rounded border-2 border-gray-900 shadow-lg"></div> {/* Trash bin */}
            <div className="absolute bottom-1/6 left-1/4 w-6 h-4 bg-red-600 rounded shadow-md"></div> {/* Trash spill */}
            <div className="absolute bottom-1/5 right-1/3 w-4 h-8 bg-blue-400 rounded-full shadow-lg border-2 border-blue-600"></div> {/* Bottle */}
            <div className="absolute bottom-1/6 left-2/3 w-4 h-3 bg-orange-500 rounded shadow-md"></div> {/* Cigarettes */}
            <div className="absolute bottom-1/5 left-1/5 w-3 h-2 bg-yellow-700 rounded shadow-sm"></div> {/* Pet waste */}
          </div>
        );
      
      case "beach":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
            {/* Water */}
            <div className="absolute bottom-1/3 w-full h-1/4 bg-blue-600"></div>
            {/* Sand */}
            <div className="absolute bottom-0 w-full h-1/3 bg-yellow-600"></div>
            {/* Waves */}
            <div className="absolute bottom-1/3 w-full h-2 bg-white opacity-60"></div>
            <div className="absolute bottom-1/4 w-full h-1 bg-white opacity-40"></div>
            {/* Sun */}
            <div className="absolute top-12 right-16 w-14 h-14 bg-yellow-400 rounded-full"></div>
            {/* Palm tree */}
            <div className="absolute bottom-1/4 left-20 w-4 h-32 bg-amber-800"></div>
            <div className="absolute bottom-1/2 left-16 w-12 h-6 bg-green-600 rounded-full"></div>
            {/* Visible Hazards - Made more prominent */}
            <div className="absolute bottom-2/5 left-1/3 w-8 h-6 bg-gray-100 border-2 border-gray-400 shadow-lg transform rotate-12"></div> {/* Plastic bag */}
            <div className="absolute bottom-2/5 right-1/4 w-16 h-8 bg-black rounded-full shadow-xl border-2 border-gray-700"></div> {/* Oil spill */}
            <div className="absolute bottom-1/3 left-1/5 w-16 h-4 bg-amber-800 shadow-lg border border-amber-900"></div> {/* Fishing net */}
            <div className="absolute bottom-1/6 right-1/6 w-6 h-10 bg-orange-600 rounded shadow-xl border-2 border-orange-800"></div> {/* Chemical barrel */}
            <div className="absolute bottom-1/5 left-1/4 w-8 h-4 bg-red-500 shadow-md border border-red-700"></div> {/* Beach litter */}
          </div>
        );
      
      case "urban":
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-gray-400 to-gray-600 overflow-hidden">
            {/* Smog layer */}
            <div className="absolute top-1/3 w-full h-12 bg-gray-700 opacity-40"></div>
            {/* Street */}
            <div className="absolute bottom-0 w-full h-2/5 bg-gray-700"></div>
            {/* Buildings */}
            <div className="absolute bottom-2/5 left-12 w-24 h-24 bg-gray-500"></div>
            <div className="absolute bottom-1/2 left-48 w-32 h-32 bg-gray-600"></div>
            <div className="absolute bottom-1/2 right-1/4 w-20 h-36 bg-gray-500"></div>
            <div className="absolute bottom-2/5 right-12 w-36 h-28 bg-gray-600"></div>
            {/* Windows */}
            <div className="absolute bottom-1/3 left-16 w-3 h-3 bg-blue-300"></div>
            <div className="absolute bottom-1/3 left-28 w-3 h-3 bg-blue-300"></div>
            <div className="absolute bottom-2/5 left-52 w-4 h-4 bg-blue-300"></div>
            {/* Factory stacks */}
            <div className="absolute bottom-1/5 right-4 w-6 h-48 bg-gray-800"></div>
            <div className="absolute bottom-1/4 right-12 w-5 h-40 bg-gray-800"></div>
            {/* Car */}
            <div className="absolute bottom-1/4 left-1/3 w-16 h-6 bg-red-600 rounded"></div>
            {/* Visible Hazards - Made more prominent */}
            <div className="absolute top-8 right-4 w-12 h-16 bg-gray-800 rounded shadow-xl border-2 border-red-600"></div> {/* Factory emissions */}
            <div className="absolute bottom-1/5 left-1/4 w-8 h-6 bg-black shadow-lg border border-gray-900 rounded-full"></div> {/* Exhaust */}
            <div className="absolute bottom-1/4 left-1/6 w-6 h-6 bg-gray-900 rounded-full shadow-lg border-2 border-yellow-500"></div> {/* Storm drain */}
            <div className="absolute bottom-1/5 right-1/3 w-8 h-4 bg-green-500 shadow-lg border-2 border-green-700 rounded"></div> {/* Chemical leak */}
            <div className="absolute bottom-1/6 right-1/4 w-4 h-16 bg-yellow-400 shadow-xl border-2 border-yellow-600"></div> {/* Light pollution */}
            <div className="absolute top-1/3 left-1/3 w-20 h-10 bg-brown-400 shadow-lg border border-brown-600 rounded opacity-80"></div> {/* Air pollution */}
          </div>
        );
      
      default:
        return (
          <div className="relative w-full h-full bg-gradient-to-b from-green-200 to-green-400">
            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
              🌍 Environmental Scene
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    loadGameStats();
  }, []);

  useEffect(() => {
    localStorage.setItem("eco-detective-stats", JSON.stringify(gameStats));
  }, [gameStats]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  const loadGameStats = () => {
    const saved = localStorage.getItem("eco-detective-stats");
    if (saved) {
      setGameStats(JSON.parse(saved));
    }
  };

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(currentScene.timeLimit);
    setFoundHazards(new Set());
    setLevelCompleted(false);
    setStartTime(Date.now());
    setWrongClicks(0);
    toast.success(`🕵️ Level ${currentLevel} started! Find all environmental hazards!`);
  };

  const handleSceneClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive || levelCompleted) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Check if click hits any hazard
    const hitHazard = currentScene.hazards.find(hazard => 
      !foundHazards.has(hazard.id) &&
      x >= hazard.x && 
      x <= hazard.x + hazard.width &&
      y >= hazard.y && 
      y <= hazard.y + hazard.height
    );

    if (hitHazard) {
      // Correct click
      const newFoundHazards = new Set(foundHazards);
      newFoundHazards.add(hitHazard.id);
      setFoundHazards(newFoundHazards);

      // Update stats
      setGameStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + hitHazard.points,
        hazardsFound: prev.hazardsFound + 1
      }));

      onPointsEarned(hitHazard.points);
      toast.success(`✅ Found: ${hitHazard.name}! +${hitHazard.points} points`);

      // Show eco-fact
      setTimeout(() => {
        toast(hitHazard.ecoFact, { 
          duration: 4000, 
          icon: "🌱",
          style: { maxWidth: "500px" }
        });
      }, 1000);

      // Check if level completed
      if (newFoundHazards.size === currentScene.hazards.length) {
        handleLevelComplete();
      }
    } else {
      // Wrong click
      setWrongClicks(prev => prev + 1);
      setClickedWrong({ x, y });
      
      // Show hint after 3 wrong clicks
      if (wrongClicks >= 2) {
        const remainingHazards = currentScene.hazards.filter(h => !foundHazards.has(h.id));
        if (remainingHazards.length > 0) {
          const randomHazard = remainingHazards[Math.floor(Math.random() * remainingHazards.length)];
          setShowHint({ show: true, hazard: randomHazard });
        }
      }

      toast.error("❌ Not quite right! Keep looking for environmental hazards.");
      
      setTimeout(() => {
        setClickedWrong(null);
      }, 1000);
    }
  };

  const handleLevelComplete = () => {
    setGameActive(false);
    setLevelCompleted(true);
    
    const completionTime = (Date.now() - startTime) / 1000;
    const accuracy = Math.round((foundHazards.size / (foundHazards.size + wrongClicks)) * 100);
    
    setGameStats(prev => ({
      ...prev,
      levelsCompleted: prev.levelsCompleted + 1,
      gamesPlayed: prev.gamesPlayed + 1,
      averageAccuracy: Math.round((prev.averageAccuracy + accuracy) / 2),
      fastestCompletion: prev.fastestCompletion === 0 ? completionTime : Math.min(prev.fastestCompletion, completionTime)
    }));

    checkBadges(completionTime, accuracy);
    toast.success(`🎉 Level ${currentLevel} Complete! Time: ${Math.round(completionTime)}s, Accuracy: ${accuracy}%`);
  };

  const handleGameOver = () => {
    setGameActive(false);
    toast.error("⏰ Time's up! Try again to find all the hazards.");
  };

  const checkBadges = (completionTime: number, accuracy: number) => {
    const newBadges = gameStats.badges.map(badge => {
      if (badge.unlocked) return badge;
      
      let achieved = false;
      
      switch (badge.id) {
        case "plastic_buster":
          // Count plastic-related hazards found
          const plasticHazards = ["plastic_bottle", "plastic_bags", "beach_litter"];
          const plasticFound = Array.from(foundHazards).filter(id => 
            plasticHazards.some(plastic => id.includes("plastic") || id.includes("bottle") || id.includes("litter"))
          ).length;
          achieved = plasticFound >= badge.requirement;
          break;
        
        case "air_quality_hero":
          const airHazards = ["factory_emissions", "car_exhaust", "air_quality"];
          const airFound = Array.from(foundHazards).filter(id => 
            airHazards.some(air => id.includes(air.split("_")[0]))
          ).length;
          achieved = airFound >= badge.requirement;
          break;
        
        case "water_guardian":
          const waterHazards = ["oil_spill", "storm_drain_pollution", "chemical_leak"];
          const waterFound = Array.from(foundHazards).filter(id => 
            waterHazards.some(water => id.includes("oil") || id.includes("drain") || id.includes("chemical"))
          ).length;
          achieved = waterFound >= badge.requirement;
          break;
        
        case "speed_detective":
          achieved = completionTime <= badge.requirement;
          break;
        
        case "master_detective":
          achieved = gameStats.levelsCompleted + 1 >= badge.requirement;
          break;
        
        case "eagle_eye":
          achieved = accuracy >= badge.requirement;
          break;
      }
      
      if (achieved) {
        toast.success(`🏆 Badge Unlocked: ${badge.name} ${badge.emoji}`);
        return { ...badge, unlocked: true };
      }
      
      return badge;
    });
    
    setGameStats(prev => ({ ...prev, badges: newBadges }));
  };

  const nextLevel = () => {
    if (currentLevel < gameScenes.length) {
      setCurrentLevel(prev => prev + 1);
      setLevelCompleted(false);
      setFoundHazards(new Set());
    }
  };

  const restartLevel = () => {
    setGameActive(false);
    setFoundHazards(new Set());
    setLevelCompleted(false);
    setTimeLeft(0);
    setWrongClicks(0);
    setShowHint({ show: false, hazard: null });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (foundHazards.size / currentScene.hazards.length) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🕵️ Eco Detective
              </CardTitle>
              <p className="text-gray-600 mt-1">{currentScene.description}</p>
              {gameActive && (
                <p className="text-sm text-blue-600 mt-1">💡 Tip: Click "Show Hints" if you need help finding hazards!</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getDifficultyColor(currentScene.difficulty)}>
                Level {currentLevel} - {currentScene.difficulty.toUpperCase()}
              </Badge>
              <Button onClick={onBack} variant="outline">
                ← Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gameStats.hazardsFound}</div>
              <div className="text-sm text-gray-600">Hazards Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{foundHazards.size}/{currentScene.hazards.length}</div>
              <div className="text-sm text-gray-600">This Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {gameActive ? formatTime(timeLeft) : "Ready"}
              </div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Level Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Game Scene */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>🎯 {currentScene.description}</span>
                </CardTitle>
                <div className="space-x-2">
                  {!gameActive && !levelCompleted && (
                    <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                      🚀 Start Investigation
                    </Button>
                  )}
                  {gameActive && (
                    <>
                      <Button 
                        onClick={() => setShowHazardOutlines(!showHazardOutlines)}
                        variant={showHazardOutlines ? "default" : "outline"}
                        size="sm"
                      >
                        {showHazardOutlines ? "🔍 Hide Hints" : "💡 Show Hints"}
                      </Button>
                      <Button onClick={restartLevel} variant="outline" size="sm">
                        🔄 Restart
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div 
                  className="relative w-full h-96 rounded-lg border-2 border-gray-300 cursor-crosshair overflow-hidden"
                  onClick={handleSceneClick}
                >
                  {renderSceneBackground(currentScene.backgroundImage)}
                  
                  {/* Unfound hazards hint overlay - visible when hints are enabled */}
                  {gameActive && showHazardOutlines && currentScene.hazards.map(hazard => (
                    !foundHazards.has(hazard.id) && (
                      <div
                        key={`hint-${hazard.id}`}
                        className="absolute border-3 border-dashed border-yellow-400 bg-yellow-100 bg-opacity-30 rounded-lg animate-pulse hover:bg-opacity-50 transition-all duration-300"
                        style={{
                          left: `${hazard.x}%`,
                          top: `${hazard.y}%`,
                          width: `${hazard.width}%`,
                          height: `${hazard.height}%`
                        }}
                        title={`Click to identify: ${hazard.name}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-yellow-600 text-sm font-bold">🎯</span>
                        </div>
                        <div className="absolute -top-6 left-0 bg-yellow-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          {hazard.name}
                        </div>
                      </div>
                    )
                  ))}
                  
                  {/* Subtle pulse indicators for hazards without full hints */}
                  {gameActive && !showHazardOutlines && currentScene.hazards.map(hazard => (
                    !foundHazards.has(hazard.id) && (
                      <div
                        key={`pulse-${hazard.id}`}
                        className="absolute border-2 border-dashed border-red-400 bg-red-100 bg-opacity-10 rounded-lg animate-pulse hover:bg-opacity-30 transition-all duration-300"
                        style={{
                          left: `${hazard.x}%`,
                          top: `${hazard.y}%`,
                          width: `${hazard.width}%`,
                          height: `${hazard.height}%`
                        }}
                        title="Environmental hazard detected - click to identify"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-red-500 text-xs opacity-50">⚠️</span>
                        </div>
                      </div>
                    )
                  ))}
                  
                  {/* Found hazards overlay */}
                  {currentScene.hazards.map(hazard => (
                    foundHazards.has(hazard.id) && (
                      <div
                        key={hazard.id}
                        className="absolute border-4 border-green-500 bg-green-200 bg-opacity-30 rounded-lg animate-pulse"
                        style={{
                          left: `${hazard.x}%`,
                          top: `${hazard.y}%`,
                          width: `${hazard.width}%`,
                          height: `${hazard.height}%`
                        }}
                      >
                        <div className="absolute -top-8 left-0 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          ✅ {hazard.name}
                        </div>
                      </div>
                    )
                  ))}

                  {/* Hint overlay */}
                  {showHint.show && showHint.hazard && (
                    <div
                      className="absolute border-4 border-yellow-400 bg-yellow-200 bg-opacity-50 rounded-lg animate-bounce"
                      style={{
                        left: `${showHint.hazard.x}%`,
                        top: `${showHint.hazard.y}%`,
                        width: `${showHint.hazard.width}%`,
                        height: `${showHint.hazard.height}%`
                      }}
                    >
                      <div className="absolute -top-8 left-0 bg-yellow-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        💡 Look here!
                      </div>
                    </div>
                  )}

                  {/* Wrong click indicator */}
                  {clickedWrong && (
                    <div
                      className="absolute w-8 h-8 bg-red-500 bg-opacity-50 rounded-full animate-ping pointer-events-none"
                      style={{
                        left: `${clickedWrong.x}%`,
                        top: `${clickedWrong.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}

                  {/* Game overlay messages */}
                  {!gameActive && !levelCompleted && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold mb-2">Ready to Investigate?</h3>
                        <p className="text-sm opacity-90">Click "Start Investigation" to begin finding environmental hazards!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Hazard Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Find These Hazards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentScene.hazards.map(hazard => (
                  <div 
                    key={hazard.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      foundHazards.has(hazard.id)
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {foundHazards.has(hazard.id) ? '✅' : '🔍'} {hazard.name}
                      </span>
                      <span className="text-xs text-blue-600">+{hazard.points}pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏆 Detective Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameStats.badges.map(badge => (
                  <div 
                    key={badge.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      badge.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`text-xl ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {badge.emoji}
                    </span>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${badge.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-600">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Level Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameScenes.map(scene => (
                  <Button
                    key={scene.id}
                    onClick={() => {
                      setCurrentLevel(scene.level);
                      restartLevel();
                    }}
                    variant={currentLevel === scene.level ? "default" : "outline"}
                    className="w-full justify-start"
                    size="sm"
                  >
                    <span className="flex items-center space-x-2">
                      <span>{scene.level === currentLevel ? '🎯' : '📍'}</span>
                      <span>Level {scene.level}</span>
                      <Badge className={getDifficultyColor(scene.difficulty)} variant="secondary">
                        {scene.difficulty}
                      </Badge>
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Level Complete Modal */}
      {levelCompleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Level Complete!</h3>
              <p className="text-gray-600 mb-4">
                Great detective work! You found all {currentScene.hazards.length} environmental hazards!
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="text-lg font-bold text-green-600">
                  Points Earned: {currentScene.hazards.reduce((sum, hazard) => 
                    foundHazards.has(hazard.id) ? sum + hazard.points : sum, 0
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {currentLevel < gameScenes.length && (
                  <Button onClick={nextLevel} className="w-full">
                    🚀 Next Level
                  </Button>
                )}
                <Button onClick={restartLevel} variant="outline" className="w-full">
                  🔄 Play Again
                </Button>
                <Button onClick={onBack} variant="outline" className="w-full">
                  ← Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hint Modal */}
      {showHint.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">Detective Hint</h3>
              <p className="text-gray-700 mb-4">
                Look for: <strong>{showHint.hazard?.name}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Check the highlighted area in the scene!
              </p>
              <Button 
                onClick={() => setShowHint({ show: false, hazard: null })} 
                className="w-full"
              >
                Continue Investigating 🔍
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};