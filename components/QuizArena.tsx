"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface QuizArenaProps {
  onSelectMode: (mode: "timed" | "survival" | "challenge" | "multiplayer") => void;
}

export default function QuizArena({ onSelectMode }: QuizArenaProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const courses = [
    { 
      id: "climate_change", 
      name: "Climate Change", 
      emoji: "🌡️", 
      difficulty: "Medium",
      description: "Master climate science and carbon footprints"
    },
    { 
      id: "waste_management", 
      name: "Waste Management", 
      emoji: "♻️", 
      difficulty: "Easy",
      description: "Learn recycling and waste reduction strategies"
    },
    { 
      id: "water_conservation", 
      name: "Water Conservation", 
      emoji: "💧", 
      difficulty: "Easy",
      description: "Discover water-saving techniques and protection"
    },
    { 
      id: "biodiversity", 
      name: "Biodiversity", 
      emoji: "🦋", 
      difficulty: "Hard",
      description: "Explore ecosystems and species protection"
    },
    { 
      id: "renewable_energy", 
      name: "Renewable Energy", 
      emoji: "⚡", 
      difficulty: "Medium",
      description: "Harness the power of sustainable energy"
    },
    { 
      id: "energy_conservation", 
      name: "Energy Conservation", 
      emoji: "💡", 
      difficulty: "Easy",
      description: "Optimize energy usage and efficiency"
    }
  ];

  const gameModes = [
    {
      id: "timed",
      name: "Speed Challenge ⚡",
      description: "Race against time! Quick-fire questions with countdown pressure.",
      features: ["⏱️ 15 seconds per question", "🎯 Bonus points for speed", "🔥 Streak multipliers"],
      color: "border-red-400 bg-red-50",
      buttonColor: "bg-red-500 hover:bg-red-600"
    },
    {
      id: "survival",
      name: "Eco Survival Mode 🌿",
      description: "Keep your streak alive! One wrong answer ends the game.",
      features: ["❤️ 3 lives only", "📈 Increasing difficulty", "🏆 High score tracking"],
      color: "border-green-400 bg-green-50",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      id: "challenge",
      name: "Daily Eco Challenge 🏅",
      description: "Special themed challenges with unique rewards.",
      features: ["🎁 Daily rewards", "🌟 Special achievements", "📊 Progress tracking"],
      color: "border-purple-400 bg-purple-50",
      buttonColor: "bg-purple-500 hover:bg-purple-600"
    },
    {
      id: "multiplayer",
      name: "Team Earth 🤝",
      description: "Collaborate with others to solve environmental puzzles.",
      features: ["👥 Team-based gameplay", "💬 Chat with teammates", "🌍 Global leaderboards"],
      color: "border-blue-400 bg-blue-50",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-700 mb-4">
            🎮 EcoLearn Quiz Arena
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Challenge yourself with different game modes and become an environmental champion!
          </p>
        </div>

        {/* Course Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-700">
              📚 Choose Your Environmental Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course.id);
                    toast.success(`${course.emoji} ${course.name} selected!`);
                  }}
                  className={`p-4 border-2 rounded-lg transition-all transform hover:scale-105 ${
                    selectedCourse === course.id 
                      ? 'border-green-500 bg-green-100' 
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{course.emoji}</div>
                  <h3 className="font-bold text-lg mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <Badge 
                    variant={course.difficulty === 'Easy' ? 'default' : course.difficulty === 'Medium' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {course.difficulty}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-700">
              🎯 Select Your Game Mode
            </CardTitle>
            <p className="text-center text-gray-600">
              {selectedCourse ? `Ready to play ${courses.find(c => c.id === selectedCourse)?.name}!` : "Choose a course above first"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameModes.map(mode => (
                <div key={mode.id} className={`p-6 border-2 rounded-xl ${mode.color}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{mode.name}</h3>
                    {mode.comingSoon && (
                      <Badge variant="outline" className="bg-yellow-100">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{mode.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {mode.features.map((feature, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {feature}
                      </div>
                    ))}
                  </div>

                  {mode.comingSoon ? (
                    <Button disabled className="w-full bg-gray-400">
                      Coming Soon
                    </Button>
                  ) : selectedCourse ? (
                    <Link href={`/Courses/${selectedCourse}?mode=${mode.id}`}>
                      <Button className={`w-full ${mode.buttonColor} text-white`}>
                        🚀 Start {mode.name}
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full bg-gray-400">
                      Select a Course First
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">12,847</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">2,156</div>
            <div className="text-sm text-gray-600">Eco Warriors</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">98.2%</div>
            <div className="text-sm text-gray-600">Learning Success Rate</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">847kg</div>
            <div className="text-sm text-gray-600">CO₂ Knowledge Saved</div>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/Home">
            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              🏠 Back to EcoLearn Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}