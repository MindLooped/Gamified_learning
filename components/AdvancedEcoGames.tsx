"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

// 1. Climate Action Hero - Action RPG Style Game
interface ClimateActionHeroProps {
  onComplete: (score: number) => void;
}

export const ClimateActionHero = ({ onComplete }: ClimateActionHeroProps) => {
  const [heroLevel, setHeroLevel] = useState(1);
  const [heroExp, setHeroExp] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameActive, setGameActive] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [heroStats, setHeroStats] = useState({
    carbonSaved: 0,
    treesPlanted: 0,
    energySaved: 0,
    waterSaved: 0
  });

  const challenges = [
    {
      type: "carbon",
      title: "Reduce Carbon Footprint",
      description: "Choose the best way to reduce CO2 emissions",
      options: [
        { text: "🚗 Drive alone to work", points: 0, feedback: "This increases emissions" },
        { text: "🚌 Take public transport", points: 3, feedback: "Great! Reduces individual carbon footprint" },
        { text: "🚲 Bike to work", points: 5, feedback: "Excellent! Zero emissions transport!" },
        { text: "🏠 Work from home", points: 4, feedback: "Smart choice! No commute emissions" }
      ]
    },
    {
      type: "energy",
      title: "Energy Conservation Challenge",
      description: "What's the most energy-efficient choice?",
      options: [
        { text: "💡 Use incandescent bulbs", points: 0, feedback: "These waste 90% energy as heat" },
        { text: "🌟 Switch to LED lights", points: 5, feedback: "Perfect! LEDs use 80% less energy" },
        { text: "🕯️ Use candles only", points: 2, feedback: "Romantic but not practical" },
        { text: "📱 Use phone flashlight", points: 1, feedback: "Creative but limited use" }
      ]
    },
    {
      type: "waste",
      title: "Zero Waste Mission",
      description: "How to minimize waste generation?",
      options: [
        { text: "🛍️ Use plastic bags", points: 0, feedback: "Creates unnecessary plastic waste" },
        { text: "♻️ Bring reusable bags", points: 5, feedback: "Hero move! Eliminates single-use plastic" },
        { text: "📦 Take paper bags", points: 2, feedback: "Better than plastic but still wasteful" },
        { text: "🎒 Carry a backpack", points: 4, feedback: "Great reusable option!" }
      ]
    },
    {
      type: "water",
      title: "Water Guardian Task",
      description: "Conserve precious water resources",
      options: [
        { text: "🚿 Take 30-minute showers", points: 0, feedback: "Wastes 150+ gallons of water" },
        { text: "⏱️ Take 5-minute showers", points: 5, feedback: "Water hero! Saves 100+ gallons" },
        { text: "🛁 Take daily baths", points: 1, feedback: "Uses more water than quick showers" },
        { text: "💧 Install water-saving fixtures", points: 4, feedback: "Smart long-term solution!" }
      ]
    },
    {
      type: "food",
      title: "Sustainable Food Quest",
      description: "Make climate-friendly food choices",
      options: [
        { text: "🥩 Eat beef daily", points: 0, feedback: "High carbon footprint (27kg CO2/kg)" },
        { text: "🌱 Choose plant-based meals", points: 5, feedback: "Climate champion! 90% lower emissions" },
        { text: "🐟 Eat sustainable seafood", points: 4, feedback: "Good choice with lower impact" },
        { text: "🥚 Local organic eggs", points: 3, feedback: "Better than factory farming" }
      ]
    },
    {
      type: "transport",
      title: "Green Transportation Hero",
      description: "Choose sustainable travel options",
      options: [
        { text: "✈️ Fly for short trips", points: 0, feedback: "Aviation has huge carbon impact" },
        { text: "🚄 Take high-speed rail", points: 5, feedback: "Eco-hero! 80% less CO2 than flying" },
        { text: "🚗 Drive electric car", points: 4, feedback: "Great if powered by renewables" },
        { text: "🚌 Use intercity bus", points: 3, feedback: "Good shared transport option" }
      ]
    }
  ];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setHeroLevel(1);
    setHeroExp(0);
    setChallengeIndex(0);
    setCurrentChallenge(challenges[0]);
    setHeroStats({ carbonSaved: 0, treesPlanted: 0, energySaved: 0, waterSaved: 0 });
    setTimeLeft(90);
  };

  const selectAction = (option: any) => {
    if (!gameActive) return;

    const points = option.points;
    setHeroExp(prev => prev + points * 10);
    
    // Update hero stats based on challenge type
    const newStats = { ...heroStats };
    switch (currentChallenge.type) {
      case 'carbon':
        newStats.carbonSaved += points * 5;
        break;
      case 'energy':
        newStats.energySaved += points * 10;
        break;
      case 'waste':
        newStats.treesPlanted += points;
        break;
      case 'water':
        newStats.waterSaved += points * 20;
        break;
    }
    setHeroStats(newStats);

    // Level up system
    const newLevel = Math.floor(heroExp / 50) + 1;
    if (newLevel > heroLevel) {
      setHeroLevel(newLevel);
      toast.success(`🎉 Level Up! You're now a Level ${newLevel} Climate Hero!`);
    }

    if (points > 3) {
      toast.success(`⭐ ${option.feedback} (+${points} points)`);
    } else if (points > 0) {
      toast(`💡 ${option.feedback} (+${points} points)`);
    } else {
      toast.error(`❌ ${option.feedback} (0 points)`);
    }

    // Move to next challenge
    setTimeout(() => {
      const nextIndex = challengeIndex + 1;
      if (nextIndex < challenges.length) {
        setChallengeIndex(nextIndex);
        setCurrentChallenge(challenges[nextIndex]);
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    setGameActive(false);
    const finalScore = Math.min(3, heroLevel);
    toast.success(`🦸‍♀️ Climate Action Hero Complete! Level ${heroLevel} achieved! Earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold mb-4 text-green-700">🦸‍♀️ Climate Action Hero</h3>
      <p className="text-gray-600 mb-6">
        Become a climate superhero! Make the right choices to level up and save the planet! 🌍
      </p>

      {/* Hero Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">Level {heroLevel}</div>
          <div className="text-sm text-blue-600">Hero Level</div>
        </div>
        <div className="bg-green-100 p-3 rounded-lg">
          <div className="text-xl font-bold text-green-700">{heroStats.carbonSaved}kg</div>
          <div className="text-sm text-green-600">CO₂ Saved</div>
        </div>
        <div className="bg-yellow-100 p-3 rounded-lg">
          <div className="text-xl font-bold text-yellow-700">{heroStats.energySaved}kWh</div>
          <div className="text-sm text-yellow-600">Energy Saved</div>
        </div>
        <div className="bg-purple-100 p-3 rounded-lg">
          <div className="text-xl font-bold text-purple-700">{heroStats.waterSaved}L</div>
          <div className="text-sm text-purple-600">Water Saved</div>
        </div>
      </div>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-lg">
          <span className="font-bold text-green-700">EXP: {heroExp}</span>
        </div>
        <div className="bg-red-100 px-4 py-2 rounded-lg">
          <span className="font-bold text-red-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 90 && (
        <Button onClick={startGame} className="mb-6 bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
          🚀 Begin Hero Journey!
        </Button>
      )}

      {gameActive && currentChallenge && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">{currentChallenge.title}</CardTitle>
            <p className="text-gray-700 text-lg">{currentChallenge.description}</p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentChallenge.options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => selectAction(option)}
                  className="p-4 bg-white hover:bg-green-100 border-2 border-green-300 hover:border-green-500 rounded-xl transition-all transform hover:scale-105 text-left"
                >
                  <div className="text-lg font-semibold mb-2">{option.text}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// 2. Ecosystem Builder - Strategy Game
interface EcosystemBuilderProps {
  onComplete: (score: number) => void;
}

export const EcosystemBuilder = ({ onComplete }: EcosystemBuilderProps) => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameActive, setGameActive] = useState(false);
  const [ecosystemHealth, setEcosystemHealth] = useState(100);
  const [resources, setResources] = useState({
    water: 50,
    nutrients: 50,
    biodiversity: 10
  });
  const [placedItems, setPlacedItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const ecosystemItems = [
    { 
      type: 'tree', 
      emoji: '🌳', 
      name: 'Tree', 
      cost: { water: 10, nutrients: 15 },
      benefit: { biodiversity: 5, water: 5 },
      description: 'Provides oxygen, stores carbon, creates habitat'
    },
    { 
      type: 'flower', 
      emoji: '🌻', 
      name: 'Flowers', 
      cost: { water: 5, nutrients: 8 },
      benefit: { biodiversity: 3, nutrients: 2 },
      description: 'Attracts pollinators, beautifies ecosystem'
    },
    { 
      type: 'bee', 
      emoji: '🐝', 
      name: 'Bees', 
      cost: { nutrients: 5 },
      benefit: { biodiversity: 8, nutrients: 10 },
      description: 'Pollinates plants, essential for food production'
    },
    { 
      type: 'pond', 
      emoji: '🏞️', 
      name: 'Pond', 
      cost: { nutrients: 20 },
      benefit: { water: 30, biodiversity: 10 },
      description: 'Water source for animals, supports aquatic life'
    },
    { 
      type: 'bird', 
      emoji: '🐦', 
      name: 'Birds', 
      cost: { water: 8, nutrients: 5 },
      benefit: { biodiversity: 6, nutrients: 5 },
      description: 'Seed dispersal, pest control, indicator species'
    },
    { 
      type: 'butterfly', 
      emoji: '🦋', 
      name: 'Butterflies', 
      cost: { nutrients: 3 },
      benefit: { biodiversity: 4 },
      description: 'Pollinators, beauty, ecosystem health indicators'
    }
  ];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (gameActive) {
      // Ecosystem decay over time
      const decayInterval = setInterval(() => {
        setResources(prev => ({
          water: Math.max(0, prev.water - 1),
          nutrients: Math.max(0, prev.nutrients - 1),
          biodiversity: Math.max(0, prev.biodiversity - 0.5)
        }));
      }, 5000);

      return () => clearInterval(decayInterval);
    }
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setEcosystemHealth(100);
    setResources({ water: 50, nutrients: 50, biodiversity: 10 });
    setPlacedItems([]);
    setTimeLeft(120);
  };

  const selectEcosystemItem = (itemType: string) => {
    setSelectedItem(itemType);
  };

  const placeItem = (x: number, y: number) => {
    if (!selectedItem || !gameActive) return;

    const item = ecosystemItems.find(i => i.type === selectedItem);
    if (!item) return;

    // Check if we can afford the item
    const canAfford = Object.entries(item.cost).every(([resource, cost]) => 
      resources[resource as keyof typeof resources] >= cost
    );

    if (!canAfford) {
      toast.error(`Not enough resources for ${item.name}`);
      return;
    }

    // Deduct costs
    const newResources = { ...resources };
    Object.entries(item.cost).forEach(([resource, cost]) => {
      newResources[resource as keyof typeof resources] -= cost;
    });

    // Add benefits
    Object.entries(item.benefit).forEach(([resource, benefit]) => {
      newResources[resource as keyof typeof resources] += benefit;
    });

    setResources(newResources);
    setPlacedItems(prev => [...prev, { ...item, x, y, id: Date.now() }]);
    
    toast.success(`🌱 Placed ${item.name}! ${item.description}`);
    setSelectedItem(null);
  };

  const endGame = () => {
    setGameActive(false);
    const finalScore = Math.min(3, Math.floor(resources.biodiversity / 20) + (placedItems.length >= 10 ? 1 : 0));
    toast.success(`🌍 Ecosystem Complete! Biodiversity: ${resources.biodiversity.toFixed(1)} - Earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center max-w-6xl mx-auto">
      <h3 className="text-3xl font-bold mb-4 text-green-700">🌍 Ecosystem Builder</h3>
      <p className="text-gray-600 mb-6">
        Build a thriving ecosystem! Balance water, nutrients, and biodiversity to create a sustainable environment.
      </p>

      {/* Resource Dashboard */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{resources.water.toFixed(1)}</div>
          <div className="text-sm text-blue-600">💧 Water</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{resources.nutrients.toFixed(1)}</div>
          <div className="text-sm text-yellow-600">🌱 Nutrients</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">{resources.biodiversity.toFixed(1)}</div>
          <div className="text-sm text-purple-600">🦋 Biodiversity</div>
        </div>
      </div>

      <div className="mb-4">
        <span className="font-bold text-gray-700">Time: {timeLeft}s | Items Placed: {placedItems.length}</span>
      </div>

      {!gameActive && timeLeft === 120 && (
        <Button onClick={startGame} className="mb-6 bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
          🚀 Build Ecosystem!
        </Button>
      )}

      {gameActive && (
        <>
          {/* Item Selection Panel */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {ecosystemItems.map(item => (
              <button
                key={item.type}
                onClick={() => selectEcosystemItem(item.type)}
                className={`p-3 border-2 rounded-lg transition-all ${
                  selectedItem === item.type 
                    ? 'border-green-500 bg-green-100' 
                    : 'border-gray-300 bg-white hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-1">{item.emoji}</div>
                <div className="text-xs font-semibold">{item.name}</div>
                <div className="text-xs text-gray-600">
                  {Object.entries(item.cost).map(([resource, cost]) => 
                    `${resource}: ${cost}`
                  ).join(', ')}
                </div>
              </button>
            ))}
          </div>

          {/* Ecosystem Building Area */}
          <div 
            className="relative w-full h-80 bg-gradient-to-b from-sky-100 to-green-200 border-2 border-green-300 rounded-lg cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              placeItem(x, y);
            }}
          >
            {placedItems.map(item => (
              <div
                key={item.id}
                className="absolute text-3xl animate-pulse"
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
                title={`${item.name}: ${item.description}`}
              >
                {item.emoji}
              </div>
            ))}
            
            {!placedItems.length && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Click to place ecosystem items! 🌱
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// 3. Pollution Patrol - Cleanup Action Game
interface PollutionPatrolProps {
  onComplete: (score: number) => void;
}

export const PollutionPatrol = ({ onComplete }: PollutionPatrolProps) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [pollutants, setPollutants] = useState<any[]>([]);
  const [cleanupStreak, setCleanupStreak] = useState(0);

  const pollutionTypes = [
    { type: 'plastic', emoji: '🗑️', points: 10, name: 'Plastic Waste' },
    { type: 'oil', emoji: '🛢️', points: 20, name: 'Oil Spill' },
    { type: 'smoke', emoji: '🏭', points: 15, name: 'Factory Smoke' },
    { type: 'litter', emoji: '🚮', points: 5, name: 'Litter' },
    { type: 'chemicals', emoji: '☢️', points: 25, name: 'Chemical Waste' }
  ];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (gameActive) {
      const spawnPollutant = () => {
        if (pollutants.length < 8) {
          const randomType = pollutionTypes[Math.floor(Math.random() * pollutionTypes.length)];
          const newPollutant = {
            id: Date.now(),
            ...randomType,
            x: Math.random() * 85 + 5,
            y: Math.random() * 75 + 10,
            age: 0
          };
          setPollutants(prev => [...prev, newPollutant]);
        }
      };

      const interval = setInterval(spawnPollutant, 2000);
      return () => clearInterval(interval);
    }
  }, [gameActive, pollutants.length]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setPollutants([]);
    setCleanupStreak(0);
    setTimeLeft(45);
  };

  const cleanupPollutant = (pollutantId: number) => {
    const pollutant = pollutants.find(p => p.id === pollutantId);
    if (!pollutant) return;

    setPollutants(prev => prev.filter(p => p.id !== pollutantId));
    
    const points = pollutant.points * (cleanupStreak >= 3 ? 2 : 1); // Streak bonus
    setScore(prev => prev + points);
    setCleanupStreak(prev => prev + 1);
    
    toast.success(`🧹 Cleaned ${pollutant.name}! +${points} points ${cleanupStreak >= 3 ? '(STREAK BONUS!)' : ''}`);
  };

  const endGame = () => {
    setGameActive(false);
    const finalScore = Math.min(3, Math.floor(score / 100));
    toast.success(`🌟 Pollution Patrol Complete! Cleaned up ${score} pollution points! Earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center">
      <h3 className="text-3xl font-bold mb-4 text-red-700">🚨 Pollution Patrol</h3>
      <p className="text-gray-600 mb-4">
        Clean up environmental pollution! Click on pollutants to remove them. Build streaks for bonus points!
      </p>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-red-100 px-4 py-2 rounded">
          <span className="font-bold text-red-700">Score: {score}</span>
        </div>
        <div className="bg-orange-100 px-4 py-2 rounded">
          <span className="font-bold text-orange-700">Streak: {cleanupStreak}</span>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded">
          <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 45 && (
        <Button onClick={startGame} className="mb-4 bg-red-600 hover:bg-red-700">
          🚀 Start Cleanup Mission!
        </Button>
      )}

      <div className="relative w-full h-80 bg-gradient-to-b from-gray-200 to-green-300 border-2 border-gray-400 rounded-lg overflow-hidden">
        {pollutants.map(pollutant => (
          <div
            key={pollutant.id}
            className="absolute cursor-pointer transform transition-all hover:scale-125 animate-pulse"
            style={{ left: `${pollutant.x}%`, top: `${pollutant.y}%` }}
            onClick={() => cleanupPollutant(pollutant.id)}
            title={`Click to clean up ${pollutant.name}`}
          >
            <div className="text-4xl">{pollutant.emoji}</div>
          </div>
        ))}
        
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            🌍 Click on pollution to clean it up! 🧹
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600 grid grid-cols-5 gap-2">
        {pollutionTypes.map(type => (
          <div key={type.type} className="bg-gray-100 p-2 rounded">
            <div className="text-lg">{type.emoji}</div>
            <div className="text-xs">{type.points}pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Game selector for different courses
export const getAdvancedGameForCourse = (courseName: string, onComplete: (score: number) => void) => {
  const course = decodeURIComponent(courseName).toLowerCase().trim();
  
  switch (course) {
    case 'climate_change':
    case 'climatechange':
    case 'climate-change':
      return <ClimateActionHero key="climate-hero" onComplete={onComplete} />;
      
    case 'biodiversity':
      return <EcosystemBuilder key="ecosystem-builder" onComplete={onComplete} />;
      
    case 'waste_management':
    case 'wastemanagement':
    case 'waste-management':
      return <PollutionPatrol key="pollution-patrol" onComplete={onComplete} />;
      
    default:
      return <ClimateActionHero key="default-climate-hero" onComplete={onComplete} />;
  }
};