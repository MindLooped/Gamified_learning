"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "@/components/Confetti";
import { getAdvancedGameForCourse } from "@/components/AdvancedEcoGames";

// Climate Change - Carbon Footprint Relay Game
interface CarbonFootprintRelayProps {
  onComplete: (score: number) => void;
}

const CarbonFootprintRelay = ({ onComplete }: CarbonFootprintRelayProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameActive, setGameActive] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [activities] = useState([
    { activity: "🚌 Take the Bus", footprint: "low", emoji: "🚌" },
    { activity: "🥩 Eat Beef", footprint: "high", emoji: "🥩" },
    { activity: "🚗 Drive SUV", footprint: "high", emoji: "🚗" },
    { activity: "🚲 Ride Bicycle", footprint: "low", emoji: "🚲" },
    { activity: "❄️ Use AC All Day", footprint: "high", emoji: "❄️" },
    { activity: "🌱 Eat Vegetables", footprint: "low", emoji: "🌱" },
    { activity: "✈️ Fly International", footprint: "high", emoji: "✈️" },
    { activity: "🏠 Use LED Lights", footprint: "low", emoji: "🏠" },
    { activity: "🔥 Burn Coal", footprint: "high", emoji: "🔥" },
    { activity: "🚶 Walk to Work", footprint: "low", emoji: "🚶" }
  ]);
  const [activityIndex, setActivityIndex] = useState(0);

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
    setScore(0);
    setActivityIndex(0);
    setCurrentActivity(activities[0]);
    setTimeLeft(45);
  };

  const selectFootprint = (selectedFootprint: string) => {
    if (!gameActive || !currentActivity) return;

    const isCorrect = selectedFootprint === currentActivity.footprint;
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success(`✅ Correct! ${currentActivity.activity} has ${currentActivity.footprint} carbon footprint!`);
    } else {
      toast.error(`❌ Wrong! ${currentActivity.activity} has ${currentActivity.footprint} carbon footprint`);
    }

    // Move to next activity
    const nextIndex = activityIndex + 1;
    if (nextIndex < activities.length) {
      setActivityIndex(nextIndex);
      setCurrentActivity(activities[nextIndex]);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameActive(false);
    const finalScore = Math.min(2, Math.floor((score / activities.length) * 2));
    toast.success(`🌍 Great job! You classified ${score}/${activities.length} activities correctly and earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4 text-blue-700">🌍 Carbon Footprint Relay</h3>
      <p className="text-gray-600 mb-4">
        Classify daily activities by their carbon footprint: Low, Medium, or High!
      </p>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-green-100 px-4 py-2 rounded">
          <span className="font-bold text-green-700">Correct: {score}/{activities.length}</span>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded">
          <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 45 && (
        <Button onClick={startGame} className="mb-4 bg-blue-600 hover:bg-blue-700">
          🚀 Start Carbon Relay!
        </Button>
      )}

      {gameActive && currentActivity && (
        <div className="space-y-6">
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="text-4xl mb-2">{currentActivity.emoji}</div>
            <h4 className="text-xl font-bold">{currentActivity.activity}</h4>
            <p className="text-gray-600">What's the carbon footprint of this activity?</p>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => selectFootprint('low')}
              className="p-4 bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-lg transition-all"
            >
              <div className="text-2xl">🟢</div>
              <div className="font-bold text-green-700">LOW</div>
              <div className="text-sm">Eco-friendly</div>
            </button>
            <button
              onClick={() => selectFootprint('medium')}
              className="p-4 bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-300 rounded-lg transition-all"
            >
              <div className="text-2xl">🟡</div>
              <div className="font-bold text-yellow-700">MEDIUM</div>
              <div className="text-sm">Moderate impact</div>
            </button>
            <button
              onClick={() => selectFootprint('high')}
              className="p-4 bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-lg transition-all"
            >
              <div className="text-2xl">🔴</div>
              <div className="font-bold text-red-700">HIGH</div>
              <div className="text-sm">Heavy impact</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Waste Management - Waste Sorting Race
interface WasteSortingRaceProps {
  onComplete: (score: number) => void;
}

const WasteSortingRace = ({ onComplete }: WasteSortingRaceProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameActive, setGameActive] = useState(false);
  const [wasteItems, setWasteItems] = useState<{ id: number; item: string; emoji: string; category: string; x: number; y: number }[]>([]);
  
  const items = [
    { item: "Plastic Bottle", emoji: "🥤", category: "plastic" },
    { item: "Newspaper", emoji: "📰", category: "paper" },
    { item: "Banana Peel", emoji: "🍌", category: "organic" },
    { item: "Aluminum Can", emoji: "🥫", category: "metal" },
    { item: "Glass Jar", emoji: "🍯", category: "glass" },
    { item: "Pizza Box", emoji: "📦", category: "paper" },
    { item: "Apple Core", emoji: "🍎", category: "organic" },
    { item: "Plastic Bag", emoji: "🛍️", category: "plastic" },
    { item: "Tin Can", emoji: "🥫", category: "metal" },
    { item: "Wine Bottle", emoji: "🍾", category: "glass" }
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
      const spawnItem = () => {
        if (wasteItems.length < 6) {
          const randomItem = items[Math.floor(Math.random() * items.length)];
          const newItem = {
            id: Date.now(),
            ...randomItem,
            x: Math.random() * 70 + 15,
            y: Math.random() * 40 + 10
          };
          setWasteItems(prev => [...prev, newItem]);
        }
      };

      const interval = setInterval(spawnItem, 2500);
      return () => clearInterval(interval);
    }
  }, [gameActive, wasteItems.length]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setWasteItems([]);
    setTimeLeft(40);
  };

  const sortItem = (itemId: number, binCategory: string) => {
    const item = wasteItems.find(i => i.id === itemId);
    if (!item) return;

    setWasteItems(prev => prev.filter(i => i.id !== itemId));
    
    if (item.category === binCategory) {
      setScore(prev => prev + 1);
      toast.success(`✅ Correct! ${item.item} goes in ${binCategory}!`);
    } else {
      toast.error(`❌ Wrong! ${item.item} should go in ${item.category}, not ${binCategory}`);
    }
  };

  const endGame = () => {
    setGameActive(false);
    const finalScore = Math.min(2, Math.floor((score / 15) * 2));
    toast.success(`♻️ Fantastic! You sorted ${score} items correctly and earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4 text-purple-700">♻️ Waste Sorting Race</h3>
      <p className="text-gray-600 mb-4">
        Sort waste items into the correct bins as fast as you can!
      </p>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-purple-100 px-4 py-2 rounded">
          <span className="font-bold text-purple-700">Sorted: {score}</span>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded">
          <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 40 && (
        <Button onClick={startGame} className="mb-4 bg-purple-600 hover:bg-purple-700">
          🚀 Start Sorting Race!
        </Button>
      )}

      {/* Recycling Bins */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[
          { type: "plastic", emoji: "🥤", color: "blue", name: "Plastic" },
          { type: "paper", emoji: "📄", color: "yellow", name: "Paper" },
          { type: "metal", emoji: "🥫", color: "gray", name: "Metal" },
          { type: "glass", emoji: "🍾", color: "green", name: "Glass" },
          { type: "organic", emoji: "🍌", color: "brown", name: "Organic" }
        ].map(bin => (
          <div
            key={bin.type}
            className={`h-20 border-4 border-dashed border-${bin.color}-400 bg-${bin.color}-100 rounded-lg flex flex-col items-center justify-center`}
            onDrop={(e) => {
              e.preventDefault();
              const itemId = parseInt(e.dataTransfer.getData("itemId"));
              sortItem(itemId, bin.type);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="text-2xl">{bin.emoji}</div>
            <div className="text-xs font-bold">{bin.name}</div>
          </div>
        ))}
      </div>

      {/* Waste Items Area */}
      <div className="relative w-full h-60 bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden">
        {wasteItems.map(item => (
          <div
            key={item.id}
            className="absolute text-3xl cursor-move hover:scale-110 transition-transform"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("itemId", item.id.toString());
            }}
            title={item.item}
          >
            {item.emoji}
          </div>
        ))}
        
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Waste items will appear here! Drag them to correct bins.
          </div>
        )}
      </div>
    </div>
  );
};

// Energy Conservation - Energy Detective Game
interface EnergyDetectiveProps {
  onComplete: (score: number) => void;
}

const EnergyDetective = ({ onComplete }: EnergyDetectiveProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [gameActive, setGameActive] = useState(false);
  const [energyWasters, setEnergyWasters] = useState([
    { id: 1, item: "💡 Lights On (Empty Room)", wastes: true, found: false, x: 20, y: 30 },
    { id: 2, item: "🔌 Phone Charger (Not Charging)", wastes: true, found: false, x: 60, y: 50 },
    { id: 3, item: "📺 TV On (No One Watching)", wastes: true, found: false, x: 80, y: 20 },
    { id: 4, item: "❄️ AC at 16°C", wastes: true, found: false, x: 30, y: 70 },
    { id: 5, item: "🖥️ Computer Sleep Mode", wastes: false, found: false, x: 70, y: 80 },
    { id: 6, item: "🌡️ Heater at 25°C", wastes: true, found: false, x: 50, y: 40 },
    { id: 7, item: "💡 LED Bulb (In Use)", wastes: false, found: false, x: 15, y: 60 },
    { id: 8, item: "🔌 Laptop Charging", wastes: false, found: false, x: 85, y: 70 }
  ]);

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
    setScore(0);
    setEnergyWasters(prev => prev.map(item => ({ ...item, found: false })));
    setTimeLeft(35);
  };

  const checkItem = (itemId: number) => {
    if (!gameActive) return;

    setEnergyWasters(prev => prev.map(item => {
      if (item.id === itemId && !item.found) {
        if (item.wastes) {
          setScore(current => current + 1);
          toast.success(`🔍 Good detective work! ${item.item} wastes energy!`);
        } else {
          toast.error(`❌ This doesn't waste energy: ${item.item}`);
        }
        return { ...item, found: true };
      }
      return item;
    }));
  };

  const endGame = () => {
    setGameActive(false);
    const totalWasters = energyWasters.filter(item => item.wastes).length;
    const finalScore = Math.min(2, Math.floor((score / totalWasters) * 2));
    toast.success(`🕵️ Great detective work! You found ${score}/${totalWasters} energy wasters and earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4 text-yellow-700">🕵️ Energy Detective</h3>
      <p className="text-gray-600 mb-4">
        Find the energy wasters! Click on items that unnecessarily consume electricity.
      </p>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-yellow-100 px-4 py-2 rounded">
          <span className="font-bold text-yellow-700">Found: {score}</span>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded">
          <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 35 && (
        <Button onClick={startGame} className="mb-4 bg-yellow-600 hover:bg-yellow-700">
          🚀 Start Detective Work!
        </Button>
      )}

      <div className="relative w-full h-80 bg-gradient-to-b from-blue-100 to-yellow-100 border-2 border-yellow-300 rounded-lg overflow-hidden">
        {energyWasters.map(item => (
          <div
            key={item.id}
            className={`absolute cursor-pointer transition-all transform hover:scale-110 ${
              item.found 
                ? (item.wastes ? 'opacity-50 scale-75' : 'opacity-30') 
                : 'hover:bg-yellow-200 p-2 rounded'
            }`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => checkItem(item.id)}
            title={gameActive ? "Click if this wastes energy!" : item.item}
          >
            <div className="text-2xl">{item.item.split(' ')[0]}</div>
            {item.found && item.wastes && <div className="text-xs text-red-600">⚡WASTER</div>}
            {item.found && !item.wastes && <div className="text-xs text-green-600">✅OK</div>}
          </div>
        ))}
        
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            🏠 Click on items that waste energy! 🔍
          </div>
        )}
      </div>
    </div>
  );
};

// Water Conservation - Leak Hunt Game
interface LeakHuntProps {
  onComplete: (score: number) => void;
}

const LeakHunt = ({ onComplete }: LeakHuntProps) => {
  const [waterSaved, setWaterSaved] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [leaks, setLeaks] = useState<{ id: number; x: number; y: number; fixed: boolean; severity: string }[]>([]);

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
      const spawnLeak = () => {
        if (leaks.length < 10) {
          const severities = ['small', 'medium', 'large'];
          const severity = severities[Math.floor(Math.random() * severities.length)];
          const newLeak = {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15,
            fixed: false,
            severity
          };
          setLeaks(prev => [...prev, newLeak]);
        }
      };

      const interval = setInterval(spawnLeak, 2000);
      return () => clearInterval(interval);
    }
  }, [gameActive, leaks.length]);

  const startGame = () => {
    setGameActive(true);
    setWaterSaved(0);
    setLeaks([]);
    setTimeLeft(30);
  };

  const fixLeak = (leakId: number) => {
    if (!gameActive) return;
    
    const leak = leaks.find(l => l.id === leakId);
    if (!leak || leak.fixed) return;

    setLeaks(prev => prev.map(l => 
      l.id === leakId ? { ...l, fixed: true } : l
    ));
    
    const waterAmount = leak.severity === 'large' ? 20 : leak.severity === 'medium' ? 15 : 10;
    setWaterSaved(prev => prev + waterAmount);
    toast.success(`💧 Fixed ${leak.severity} leak! Saved ${waterAmount}L of water!`);
  };

  const endGame = () => {
    setGameActive(false);
    const score = Math.min(2, Math.floor((waterSaved / 100) * 2));
    toast.success(`🏆 Excellent work! You saved ${waterSaved} liters of water and earned ${score} points!`);
    onComplete(score);
  };

  const getLeakEmoji = (severity: string, fixed: boolean) => {
    if (fixed) return '✅';
    switch (severity) {
      case 'large': return '💧💧💧';
      case 'medium': return '💧💧';
      default: return '💧';
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4 text-blue-700">🔍 Leak Hunt</h3>
      <p className="text-gray-600 mb-4">
        Find and fix water leaks around the house! Bigger leaks save more water when fixed.
      </p>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-blue-100 px-4 py-2 rounded">
          <span className="font-bold text-blue-700">Water Saved: {waterSaved}L</span>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded">
          <span className="font-bold text-gray-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 30 && (
        <Button onClick={startGame} className="mb-4 bg-blue-600 hover:bg-blue-700">
          🚀 Start Leak Hunt!
        </Button>
      )}

      <div className="relative w-full h-80 bg-gradient-to-b from-blue-100 to-blue-200 border-2 border-blue-300 rounded-lg overflow-hidden">
        {leaks.map(leak => (
          <div
            key={leak.id}
            className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-125 ${
              leak.fixed ? 'animate-pulse scale-75' : 'animate-bounce'
            }`}
            style={{ left: `${leak.x}%`, top: `${leak.y}%` }}
            onClick={() => fixLeak(leak.id)}
            title={leak.fixed ? 'Fixed!' : `${leak.severity} leak - click to fix!`}
          >
            {getLeakEmoji(leak.severity, leak.fixed)}
          </div>
        ))}
        
        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-opacity-50">
            🏠 Look for water leaks and click to fix them! 💧
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        💧 Small leak = 10L | 💧💧 Medium = 15L | 💧💧💧 Large = 20L
      </div>
    </div>
  );
};

// Biodiversity - Animal-Plant Match Game
interface AnimalPlantMatchProps {
  onComplete: (score: number) => void;
}

const AnimalPlantMatch = ({ onComplete }: AnimalPlantMatchProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [gameActive, setGameActive] = useState(false);
  const [currentPair, setCurrentPair] = useState<any>(null);
  const [pairIndex, setPairIndex] = useState(0);
  
  const ecosystemPairs = [
    { animal: "🐝", plant: "🌻", habitat: "Garden", description: "Bee pollinates sunflower" },
    { animal: "🐨", plant: "🌿", habitat: "Forest", description: "Koala eats eucalyptus leaves" },
    { animal: "🦋", plant: "🌺", habitat: "Meadow", description: "Butterfly drinks nectar from flowers" },
    { animal: "🐰", plant: "🥕", habitat: "Field", description: "Rabbit eats carrots and vegetables" },
    { animal: "🐼", plant: "🎋", habitat: "Bamboo Forest", description: "Panda eats bamboo" },
    { animal: "🦒", plant: "🌳", habitat: "Savanna", description: "Giraffe eats leaves from tall trees" },
    { animal: "🐠", plant: "🌱", habitat: "Ocean", description: "Fish depend on seaweed for shelter" },
    { animal: "🐦", plant: "🍒", habitat: "Orchard", description: "Bird eats fruits and spreads seeds" }
  ];

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

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
    setScore(0);
    setPairIndex(0);
    setupNextPair(0);
    setTimeLeft(50);
  };

  const setupNextPair = (index: number) => {
    if (index >= ecosystemPairs.length) {
      endGame();
      return;
    }

    const pair = ecosystemPairs[index];
    setCurrentPair(pair);
    
    // Create options: correct plant + 3 random wrong plants
    const otherPlants = ecosystemPairs
      .filter((_, i) => i !== index)
      .map(p => p.plant)
      .slice(0, 3);
    
    const options = [pair.plant, ...otherPlants].sort(() => Math.random() - 0.5);
    setShuffledOptions(options);
  };

  const selectPlant = (selectedPlant: string) => {
    if (!gameActive || !currentPair) return;

    const isCorrect = selectedPlant === currentPair.plant;
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success(`✅ Correct! ${currentPair.description}!`);
    } else {
      toast.error(`❌ Wrong! ${currentPair.animal} matches with ${currentPair.plant}`);
    }

    // Move to next pair
    setTimeout(() => {
      const nextIndex = pairIndex + 1;
      setPairIndex(nextIndex);
      setupNextPair(nextIndex);
    }, 1500);
  };

  const endGame = () => {
    setGameActive(false);
    const finalScore = Math.min(2, Math.floor((score / ecosystemPairs.length) * 2));
    toast.success(`🌱 Amazing! You matched ${score}/${ecosystemPairs.length} pairs correctly and earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4 text-green-700">🌱 Animal-Plant Match</h3>
      <p className="text-gray-600 mb-4">
        Match animals with their food sources or habitats! Learn about ecosystem relationships.
      </p>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-green-100 px-4 py-2 rounded">
          <span className="font-bold text-green-700">Matched: {score}/{ecosystemPairs.length}</span>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded">
          <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 50 && (
        <Button onClick={startGame} className="mb-4 bg-green-600 hover:bg-green-700">
          🚀 Start Matching!
        </Button>
      )}

      {gameActive && currentPair && (
        <div className="space-y-6">
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-6xl mb-4">{currentPair.animal}</div>
            <h4 className="text-xl font-bold mb-2">Which plant does this animal depend on?</h4>
            <p className="text-gray-600">Habitat: {currentPair.habitat}</p>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shuffledOptions.map((plant, index) => (
              <button
                key={index}
                onClick={() => selectPlant(plant)}
                className="p-6 bg-white hover:bg-green-100 border-2 border-green-300 rounded-lg transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2">{plant}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!gameActive && timeLeft === 50 && (
        <div className="mt-6 text-sm text-gray-600">
          Learn how animals and plants depend on each other in ecosystems! 🌍
        </div>
      )}
    </div>
  );
};

// Renewable Energy - Eco-Bingo (Energy Sources)
interface EcoBingoProps {
  onComplete: (score: number) => void;
}

const EcoBingo = ({ onComplete }: EcoBingoProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [calledItems, setCalledItems] = useState<string[]>([]);
  const [currentCall, setCurrentCall] = useState<string>('');
  
  const energyTerms = [
    "☀️ Solar", "💨 Wind", "💧 Hydro", "🌱 Biomass", 
    "🌊 Tidal", "🔥 Coal", "⚡ Nuclear", "🌍 Geothermal",
    "🛢️ Oil", "⛽ Gas", "🔋 Battery", "🌿 Renewable",
    "♻️ Recycling", "🏭 Power Plant", "🚗 Electric Car", "💡 LED"
  ];

  const [playerCard] = useState(() => {
    // Generate a random 4x4 bingo card
    const shuffled = [...energyTerms].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 16);
  });

  const [markedSquares, setMarkedSquares] = useState<boolean[]>(new Array(16).fill(false));

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
      const interval = setInterval(() => {
        const availableTerms = energyTerms.filter(term => !calledItems.includes(term));
        if (availableTerms.length > 0) {
          const nextCall = availableTerms[Math.floor(Math.random() * availableTerms.length)];
          setCurrentCall(nextCall);
          setCalledItems(prev => [...prev, nextCall]);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [gameActive, calledItems]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCalledItems([]);
    setCurrentCall('');
    setMarkedSquares(new Array(16).fill(false));
    setTimeLeft(60);
  };

  const markSquare = (index: number) => {
    if (!gameActive || markedSquares[index]) return;

    const squareTerm = playerCard[index];
    if (calledItems.includes(squareTerm)) {
      const newMarked = [...markedSquares];
      newMarked[index] = true;
      setMarkedSquares(newMarked);
      setScore(prev => prev + 1);
      toast.success(`✅ Marked: ${squareTerm}!`);

      // Check for bingo (any row, column, or diagonal)
      if (checkBingo(newMarked)) {
        toast.success("🎉 BINGO! You completed a line!");
        setTimeout(endGame, 1000);
      }
    } else {
      toast.error(`❌ ${squareTerm} hasn't been called yet!`);
    }
  };

  const checkBingo = (marked: boolean[]) => {
    // Check rows
    for (let i = 0; i < 4; i++) {
      if (marked.slice(i * 4, (i + 1) * 4).every(Boolean)) return true;
    }
    // Check columns
    for (let i = 0; i < 4; i++) {
      if ([0, 1, 2, 3].map(row => marked[row * 4 + i]).every(Boolean)) return true;
    }
    // Check diagonals
    if ([0, 5, 10, 15].map(i => marked[i]).every(Boolean)) return true;
    if ([3, 6, 9, 12].map(i => marked[i]).every(Boolean)) return true;
    
    return false;
  };

  const endGame = () => {
    setGameActive(false);
    const finalScore = Math.min(2, Math.floor((score / 8) * 2));
    toast.success(`🎯 Great game! You marked ${score} squares and earned ${finalScore} points!`);
    onComplete(finalScore);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4 text-orange-700">🎯 Eco-Bingo: Energy Edition</h3>
      <p className="text-gray-600 mb-4">
        Mark the energy terms as they're called! Get a row, column, or diagonal to win!
      </p>

      <div className="mb-4 flex justify-center space-x-6">
        <div className="bg-orange-100 px-4 py-2 rounded">
          <span className="font-bold text-orange-700">Marked: {score}</span>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded">
          <span className="font-bold text-blue-700">Time: {timeLeft}s</span>
        </div>
      </div>

      {currentCall && gameActive && (
        <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
          <h4 className="text-2xl font-bold text-yellow-800">Called: {currentCall}</h4>
        </div>
      )}

      {!gameActive && timeLeft === 60 && (
        <Button onClick={startGame} className="mb-4 bg-orange-600 hover:bg-orange-700">
          🚀 Start Eco-Bingo!
        </Button>
      )}

      {/* Bingo Card */}
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-4">
        {playerCard.map((term, index) => (
          <button
            key={index}
            onClick={() => markSquare(index)}
            className={`p-3 text-sm font-bold border-2 rounded transition-all ${
              markedSquares[index] 
                ? 'bg-green-200 border-green-500 text-green-800' 
                : 'bg-white border-gray-300 hover:border-orange-400'
            }`}
          >
            {term}
          </button>
        ))}
      </div>

      {gameActive && (
        <div className="text-sm text-gray-600">
          <p>Called items: {calledItems.slice(-5).join(', ')}</p>
          <p>Listen for energy terms and click to mark them!</p>
        </div>
      )}
    </div>
  );
};

// Course-specific game selector for beginner-friendly games
const getBeginnerGameForCourse = (courseName: string, onComplete: (score: number) => void) => {
  const course = decodeURIComponent(courseName).toLowerCase().trim();
  
  console.log('🎮 Beginner Game Selection:');
  console.log('  Original courseName:', courseName);
  console.log('  Normalized course:', course);
  
  switch (course) {
    case 'climate_change':
    case 'climatechange':
    case 'climate-change':
      console.log('  ✅ Selected: CarbonFootprintRelay (Climate Change)');
      return <CarbonFootprintRelay key="carbon-relay" onComplete={onComplete} />;
      
    case 'energy_conservation':
    case 'energyconservation':
    case 'energy-conservation':
      console.log('  ✅ Selected: EnergyDetective (Energy Conservation)');
      return <EnergyDetective key="energy-detective" onComplete={onComplete} />;
      
    case 'water_conservation':
    case 'waterconservation':
    case 'water-conservation':
      console.log('  ✅ Selected: LeakHunt (Water Conservation)');
      return <LeakHunt key="leak-hunt" onComplete={onComplete} />;
      
    case 'biodiversity':
      console.log('  ✅ Selected: AnimalPlantMatch (Biodiversity)');
      return <AnimalPlantMatch key="animal-plant-match" onComplete={onComplete} />;
      
    case 'waste_management':
    case 'wastemanagement':
    case 'waste-management':
      console.log('  ✅ Selected: WasteSortingRace (Waste Management)');
      return <WasteSortingRace key="waste-sorting-race" onComplete={onComplete} />;
      
    case 'renewable_energy':
    case 'renewableenergy':
    case 'renewable-energy':
      console.log('  ✅ Selected: EcoBingo (Renewable Energy)');
      return <EcoBingo key="eco-bingo" onComplete={onComplete} />;
      
    default:
      // Fallback to carbon footprint game
      console.log('  ⚠️ Using fallback CarbonFootprintRelay for unknown course:', course);
      return <CarbonFootprintRelay key="fallback-carbon-relay" onComplete={onComplete} />;
  }
};

// Main Enhanced Quiz Component (Updated)
interface BeginnerFriendlyQuizProps {
  courseName: string;
  questions: any[];
  onComplete: (score: number) => void;
}

export default function BeginnerFriendlyQuiz({ courseName, questions, onComplete }: BeginnerFriendlyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gamePhase, setGamePhase] = useState<"selection" | "question" | "game" | "advanced-game" | "complete">("selection");
  const [gameScore, setGameScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameMode, setGameMode] = useState<"beginner" | "advanced">("beginner");

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion === questions.length - 1) {
        // Switch to appropriate game phase based on mode
        setGamePhase(gameMode === "advanced" ? "advanced-game" : "game");
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer("");
        setShowResult(false);
      }
    }, 1500);
  };

  const handleGameComplete = (points: number) => {
    setGameScore(points);
    const finalScore = score + points;
    
    if (finalScore >= questions.length * 0.7) {
      setShowConfetti(true);
    }
    
    setTimeout(() => {
      setGamePhase("complete");
      onComplete(finalScore);
    }, 1000);
  };

  if (gamePhase === "selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Toaster />
        
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-4xl text-green-700 mb-4">🎮 Choose Your Quiz Adventure!</CardTitle>
              <p className="text-lg text-gray-600">
                Select your preferred difficulty level for the {courseName} quiz experience
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Beginner Mode */}
                <button
                  onClick={() => {
                    setGameMode("beginner");
                    setGamePhase("question");
                    toast.success("🌱 Beginner Mode Selected! Fun and educational games await!");
                  }}
                  className="p-6 bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-xl transition-all transform hover:scale-105"
                >
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Beginner Mode</h3>
                  <p className="text-gray-700 mb-4">Perfect for newcomers! Simple, fun games that teach environmental basics.</p>
                  <div className="space-y-2 text-sm text-green-700">
                    <div>✅ Easy-to-understand games</div>
                    <div>✅ Quick 30-60 second challenges</div>
                    <div>✅ Immediate feedback and tips</div>
                    <div>✅ Colorful, engaging activities</div>
                  </div>
                </button>

                {/* Advanced Mode */}
                <button
                  onClick={() => {
                    setGameMode("advanced");
                    setGamePhase("question");
                    toast.success("🚀 Advanced Mode Selected! Strategic environmental challenges ahead!");
                  }}
                  className="p-6 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-xl transition-all transform hover:scale-105"
                >
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">Advanced Mode</h3>
                  <p className="text-gray-700 mb-4">For eco-warriors! Complex strategy games and deeper environmental challenges.</p>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div>🎯 Strategic gameplay</div>
                    <div>🎯 Resource management</div>
                    <div>🎯 Real-world scenarios</div>
                    <div>🎯 Multi-level challenges</div>
                  </div>
                </button>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tip:</strong> Both modes cover the same environmental topics but with different gameplay styles. 
                  Choose based on your gaming preference!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === "complete") {
    const percentage = ((score + gameScore) / (questions.length + 2)) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Toaster />
        {showConfetti && <Confetti />}
        
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-3xl text-green-700">🎉 Quiz Complete!</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-2xl font-bold">
                Final Score: {score + gameScore} / {questions.length + 2}
              </div>
              
              <div className="space-y-2">
                <div className="text-lg">Questions: {score}/{questions.length}</div>
                <div className="text-lg">Game: {gameScore}/2</div>
                <div className="text-lg font-bold text-green-600">
                  Percentage: {percentage.toFixed(1)}%
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Link href="/Home">
                  <Button className="bg-green-600 hover:bg-green-700">
                    🏠 Back to Courses
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="border-green-600 text-green-600">
                    🏆 View Leaderboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === "game") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Toaster />
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>🎮 Beginner-Friendly Game - {courseName}</span>
              <span>Complete the educational game!</span>
            </div>
            
            {/* Large Central Score Display for Game Phase */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full px-8 py-4 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">📚 {score}/{questions.length}</div>
                  <div className="text-sm font-medium opacity-90">Quiz Score</div>
                </div>
              </div>
            </div>
            
            <Progress value={100} className="h-3" />
          </div>

          <Card className="min-h-[500px]">
            <CardContent className="p-6">
              {getBeginnerGameForCourse(courseName, handleGameComplete)}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === "advanced-game") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Toaster />
        
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>🚀 Advanced Environmental Challenge - {courseName}</span>
              <span>Master the strategic game!</span>
            </div>
            
            {/* Large Central Score Display for Advanced Game Phase */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full px-8 py-4 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">🚀 {score}/{questions.length}</div>
                  <div className="text-sm font-medium opacity-90">Quiz Score</div>
                </div>
              </div>
            </div>
            
            <Progress value={100} className="h-3" />
          </div>

          <Card className="min-h-[600px]">
            <CardContent className="p-6">
              {getAdvancedGameForCourse(courseName, handleGameComplete)}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Question phase (same as before)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Toaster />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          {/* Top Header with Question Info */}
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          
          {/* Large Central Score Display */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-8 py-4 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold">🏆 {score}</div>
                <div className="text-sm font-medium opacity-90">Current Score</div>
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-xl">{questions[currentQuestion]?.question}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {questions[currentQuestion]?.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedAnswer === option 
                      ? "bg-blue-100 border-blue-500 text-blue-700" 
                      : "bg-white border-gray-200 hover:border-blue-300"
                  } ${showResult && option === questions[currentQuestion].answer ? "bg-green-100 border-green-500" : ""}
                  ${showResult && selectedAnswer === option && option !== questions[currentQuestion].answer ? "bg-red-100 border-red-500" : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg border ${
                selectedAnswer === questions[currentQuestion].answer 
                  ? "bg-green-100 border-green-300 text-green-700" 
                  : "bg-red-100 border-red-300 text-red-700"
              }`}>
                {selectedAnswer === questions[currentQuestion].answer 
                  ? "✅ Correct! Well done!" 
                  : `❌ Wrong. The correct answer is: ${questions[currentQuestion].answer}`
                }
              </div>
            )}

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleAnswer}
                disabled={!selectedAnswer || showResult}
                className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
              >
                {currentQuestion === questions.length - 1 ? "Finish Questions" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}