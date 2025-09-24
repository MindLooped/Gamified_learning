"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AnimatedProgressProps {
  value: number;
  max: number;
  label: string;
  color: string;
  emoji: string;
  animate?: boolean;
}

export const AnimatedProgress = ({ value, max, label, color, emoji, animate = true }: AnimatedProgressProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animate) {
      const timer = setInterval(() => {
        setDisplayValue(prev => {
          if (prev < value) {
            return Math.min(prev + Math.ceil(value / 20), value);
          }
          return value;
        });
      }, 50);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{emoji}</span>
            <span className="font-semibold text-gray-800">{label}</span>
          </div>
          <span className="text-lg font-bold" style={{ color }}>
            {displayValue}/{max}
          </span>
        </div>
        
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${(displayValue / max) * 100}%`,
              background: `linear-gradient(90deg, ${color}, ${color}dd)`
            }}
          />
          
          {/* Sparkle effect */}
          {percentage > 0 && (
            <div
              className="absolute top-1/2 transform -translate-y-1/2 text-white text-xs animate-pulse"
              style={{ left: `${Math.min(percentage, 95)}%` }}
            >
              ✨
            </div>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {percentage.toFixed(1)}% Complete
        </div>
      </CardContent>
    </Card>
  );
};

interface FloatingPointsProps {
  points: number;
  show: boolean;
  onComplete: () => void;
}

export const FloatingPoints = ({ points, show, onComplete }: FloatingPointsProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-bounce text-4xl font-bold text-green-600 bg-white/90 px-4 py-2 rounded-lg shadow-lg border-2 border-green-300">
        +{points} 🎉
      </div>
    </div>
  );
};

interface BadgeUnlockAnimationProps {
  badge: { name: string; emoji: string; description: string };
  show: boolean;
  onComplete: () => void;
}

export const BadgeUnlockAnimation = ({ badge, show, onComplete }: BadgeUnlockAnimationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-8 rounded-2xl shadow-2xl border-4 border-yellow-400 animate-pulse">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">{badge.emoji}</div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">🏆 Badge Unlocked!</h2>
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">{badge.name}</h3>
          <p className="text-yellow-600">{badge.description}</p>
          <div className="mt-4 text-yellow-500">
            ✨ Congratulations! ✨
          </div>
        </div>
      </div>
    </div>
  );
};

interface StreakCounterProps {
  streak: number;
  maxStreak: number;
}

export const StreakCounter = ({ streak, maxStreak }: StreakCounterProps) => {
  const flames = Array.from({ length: Math.min(streak, 10) }, (_, i) => i);
  
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardContent className="p-6 text-center">
        <div className="mb-3">
          <div className="flex justify-center space-x-1 mb-2">
            {flames.map((_, index) => (
              <span
                key={index}
                className="text-2xl animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                🔥
              </span>
            ))}
          </div>
        </div>
        
        <div className="text-3xl font-bold text-orange-600 mb-1">{streak}</div>
        <div className="text-sm text-orange-500 mb-2">Day Streak</div>
        
        {streak > 0 && (
          <div className="text-xs text-gray-600">
            Personal Best: {maxStreak} days
          </div>
        )}
        
        {streak >= 7 && (
          <div className="mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            🔥 On Fire! Keep it up!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ImpactVisualizationProps {
  treesPlanted: number;
  plasticCleaned: number;
  co2Saved: number;
  waterSaved: number;
}

export const ImpactVisualization = ({ treesPlanted, plasticCleaned, co2Saved, waterSaved }: ImpactVisualizationProps) => {
  const impacts = [
    {
      label: "Trees Planted",
      value: treesPlanted,
      emoji: "🌳",
      color: "#16a34a",
      unit: "",
      equivalent: `${(treesPlanted * 22).toFixed(1)} kg CO₂ absorbed/year`,
      icon: "🌱"
    },
    {
      label: "Plastic Cleaned",
      value: plasticCleaned,
      emoji: "♻️",
      color: "#2563eb",
      unit: "kg",
      equivalent: `${(plasticCleaned * 2.5).toFixed(1)} ocean animals saved`,
      icon: "🐠"
    },
    {
      label: "CO₂ Reduced",
      value: co2Saved,
      emoji: "🌍",
      color: "#7c3aed",
      unit: "kg",
      equivalent: `${(co2Saved * 0.5).toFixed(1)} car miles offset`,
      icon: "🚗"
    },
    {
      label: "Water Saved",
      value: waterSaved,
      emoji: "💧",
      color: "#0891b2",
      unit: "L",
      equivalent: `${Math.floor(waterSaved / 8)} days of drinking water`,
      icon: "🚰"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {impacts.map((impact) => (
        <Card key={impact.label} className="overflow-hidden bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{impact.emoji}</span>
                <div>
                  <div className="font-semibold text-gray-800">{impact.label}</div>
                  <div className="text-2xl font-bold" style={{ color: impact.color }}>
                    {impact.value}{impact.unit}
                  </div>
                </div>
              </div>
              <div className="text-4xl opacity-20">{impact.icon}</div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Real-world impact:</div>
              <div className="text-sm font-medium text-gray-800">{impact.equivalent}</div>
            </div>
            
            {/* Visual representation */}
            <div className="mt-4 flex justify-center">
              {Array.from({ length: Math.min(Math.floor(impact.value / 5), 10) }, (_, i) => (
                <span
                  key={i}
                  className="text-lg opacity-70 animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {impact.emoji}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};