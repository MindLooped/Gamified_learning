"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  ecoPoints: number;
  category: "waste" | "energy" | "water" | "transport" | "biodiversity";
  completed: boolean;
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Zero Waste Day",
    description: "Complete a full day without generating any non-recyclable waste",
    ecoPoints: 50,
    category: "waste",
    completed: false
  },
  {
    id: "2", 
    title: "Energy Detective",
    description: "Conduct a home energy audit and identify 3 energy-saving opportunities",
    ecoPoints: 30,
    category: "energy",
    completed: false
  },
  {
    id: "3",
    title: "Water Guardian",
    description: "Track your water usage for a week and reduce it by 20%",
    ecoPoints: 40,
    category: "water",
    completed: false
  },
  {
    id: "4",
    title: "Green Commuter",
    description: "Use sustainable transportation (walk, cycle, public transport) for 5 days",
    ecoPoints: 35,
    category: "transport", 
    completed: false
  },
  {
    id: "5",
    title: "Biodiversity Champion",
    description: "Plant a tree or create a small garden space",
    ecoPoints: 60,
    category: "biodiversity",
    completed: false
  }
];

export default function EcoChallenges() {
  const [userChallenges, setUserChallenges] = useState<Challenge[]>(challenges);
  const [totalEcoPoints, setTotalEcoPoints] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("ecoChallenges");
    const savedPoints = localStorage.getItem("ecoPoints");
    
    if (saved) {
      setUserChallenges(JSON.parse(saved));
    }
    if (savedPoints) {
      setTotalEcoPoints(parseInt(savedPoints));
    }
  }, []);

  const completeChallenge = (challengeId: string) => {
    const updated = userChallenges.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        const newPoints = totalEcoPoints + challenge.ecoPoints;
        setTotalEcoPoints(newPoints);
        localStorage.setItem("ecoPoints", newPoints.toString());
        toast.success(`🌱 Challenge completed! +${challenge.ecoPoints} Eco Points`);
        return { ...challenge, completed: true };
      }
      return challenge;
    });
    
    setUserChallenges(updated);
    localStorage.setItem("ecoChallenges", JSON.stringify(updated));
  };

  const completedCount = userChallenges.filter(c => c.completed).length;
  const progressPercentage = (completedCount / userChallenges.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🌍 EcoLife Challenges</h1>
        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold text-green-800">Your Eco Points: {totalEcoPoints}</h2>
          <Progress value={progressPercentage} className="mt-2" />
          <p className="text-sm text-green-600 mt-2">
            {completedCount} of {userChallenges.length} challenges completed
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userChallenges.map((challenge) => (
          <Card key={challenge.id} className={`p-4 ${challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{challenge.title}</h3>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                challenge.category === 'waste' ? 'bg-orange-100 text-orange-800' :
                challenge.category === 'energy' ? 'bg-yellow-100 text-yellow-800' :
                challenge.category === 'water' ? 'bg-blue-100 text-blue-800' :
                challenge.category === 'transport' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {challenge.category}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-600">
                🌱 {challenge.ecoPoints} points
              </span>
              {challenge.completed ? (
                <span className="text-green-600 font-semibold">✅ Completed</span>
              ) : (
                <Button 
                  onClick={() => completeChallenge(challenge.id)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  Complete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <h3 className="text-xl font-bold mb-4">🏆 Environmental Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Actions Taken</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalEcoPoints}</div>
              <div className="text-sm text-gray-600">Eco Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(totalEcoPoints * 0.1)}
              </div>
              <div className="text-sm text-gray-600">CO₂ Saved (kg)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(totalEcoPoints * 0.05)}
              </div>
              <div className="text-sm text-gray-600">Trees Equivalent</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}