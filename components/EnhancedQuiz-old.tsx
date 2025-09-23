"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "@/components/Confetti";

interface PlantGameProps {
  onComplete: (score: number) => void;
  targetPlants: number;
}

const PlantGame = ({ onComplete, targetPlants }: PlantGameProps) => {
  const [plantedCount, setPlantedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [plants, setPlants] = useState<{ id: number; x: number; y: number }[]>([]);

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
    setPlantedCount(0);
    setPlants([]);
    setTimeLeft(30);
  };

  const plantTree = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive || plantedCount >= targetPlants) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPlant = { id: plantedCount + 1, x, y };
    setPlants([...plants, newPlant]);
    setPlantedCount(plantedCount + 1);
    
    toast.success(`🌱 Plant ${plantedCount + 1} planted!`);
    
    if (plantedCount + 1 >= targetPlants) {
      endGame();
    }
  };

  const endGame = () => {
    setGameActive(false);
    const score = Math.min(plantedCount, targetPlants);
    const percentage = (score / targetPlants) * 100;
    
    if (percentage >= 80) {
      toast.success(`🎉 Excellent! You planted ${score}/${targetPlants} trees!`);
      onComplete(100);
    } else if (percentage >= 60) {
      toast.success(`👏 Good job! You planted ${score}/${targetPlants} trees!`);
      onComplete(75);
    } else {
      toast.error(`🌱 Keep trying! You planted ${score}/${targetPlants} trees.`);
      onComplete(50);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">Plant {targetPlants} Trees Challenge! 🌱</h3>
        <p className="text-gray-600 mb-4">Click anywhere in the garden to plant trees. You have 30 seconds!</p>
        
        {!gameActive && plantedCount === 0 && (
          <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
            🌱 Start Planting!
          </Button>
        )}
        
        {gameActive && (
          <div className="flex justify-center gap-4 mb-4">
            <Badge>Trees: {plantedCount}/{targetPlants}</Badge>
            <Badge variant="outline">Time: {timeLeft}s</Badge>
          </div>
        )}
      </div>
      
      {(gameActive || plantedCount > 0) && (
        <div 
          className="relative bg-gradient-to-b from-sky-200 to-green-200 h-64 rounded-lg border-2 border-green-300 cursor-pointer overflow-hidden"
          onClick={plantTree}
        >
          {/* Background elements */}
          <div className="absolute bottom-0 w-full h-20 bg-green-300 rounded-b-lg"></div>
          <div className="absolute top-4 right-4 text-yellow-400 text-2xl">☀️</div>
          <div className="absolute top-8 left-8 text-white text-xl">☁️</div>
          
          {/* Planted trees */}
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="absolute text-2xl animate-bounce"
              style={{ left: plant.x - 10, top: plant.y - 20 }}
            >
              🌳
            </div>
          ))}
          
          {gameActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-green-700 font-semibold bg-white bg-opacity-80 px-4 py-2 rounded-lg">
                Click to plant trees! 🌱
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface RecycleGameProps {
  onComplete: (score: number) => void;
}

const RecycleGame = ({ onComplete }: RecycleGameProps) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([
    { id: 1, name: "Plastic Bottle", type: "plastic", emoji: "🍼" },
    { id: 2, name: "Newspaper", type: "paper", emoji: "📰" },
    { id: 3, name: "Glass Jar", type: "glass", emoji: "🫙" },
    { id: 4, name: "Aluminum Can", type: "metal", emoji: "🥤" },
    { id: 5, name: "Banana Peel", type: "organic", emoji: "🍌" },
    { id: 6, name: "Cardboard Box", type: "paper", emoji: "📦" }
  ]);
  const [completed, setCompleted] = useState(false);
  
  const bins = [
    { type: "plastic", color: "bg-blue-200", label: "Plastic" },
    { type: "paper", color: "bg-yellow-200", label: "Paper" },
    { type: "glass", color: "bg-green-200", label: "Glass" },
    { type: "metal", color: "bg-gray-200", label: "Metal" },
    { type: "organic", color: "bg-brown-200", label: "Organic" }
  ];

  const handleDrop = (itemId: number, binType: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.type === binType) {
      setScore(score + 1);
      toast.success(`✅ Correct! ${item.name} goes in ${binType}!`);
      setItems(items.filter(i => i.id !== itemId));
      
      if (items.length === 1) {
        setCompleted(true);
        const finalScore = score + 1;
        const percentage = (finalScore / 6) * 100;
        setTimeout(() => onComplete(percentage >= 80 ? 100 : percentage >= 60 ? 75 : 50), 1000);
      }
    } else {
      toast.error(`❌ Wrong bin! Try again.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">Recycle Challenge! ♻️</h3>
        <p className="text-gray-600 mb-4">Drag items to the correct recycling bins!</p>
        <Badge>Score: {score}/6</Badge>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {bins.map((bin) => (
          <div
            key={bin.type}
            className={`${bin.color} border-2 border-dashed border-gray-400 h-20 rounded-lg flex items-center justify-center text-sm font-semibold`}
            onDrop={(e) => {
              e.preventDefault();
              const itemId = parseInt(e.dataTransfer.getData("text/plain"));
              handleDrop(itemId, bin.type);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {bin.label}
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id.toString())}
            className="bg-white border-2 border-gray-300 rounded-lg p-3 cursor-move hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl mb-1">{item.emoji}</div>
            <div className="text-xs">{item.name}</div>
          </div>
        ))}
      </div>
      
      {completed && (
        <div className="text-center text-green-600 font-bold">
          🎉 All items recycled correctly!
        </div>
      )}
    </div>
  );
};

interface QuizGameProps {
  courseName: string;
  questions: any[];
  onComplete: (score: number) => void;
}

export default function EnhancedQuiz({ courseName, questions, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gamePhase, setGamePhase] = useState<"question" | "game">("question");
  const [gameType, setGameType] = useState<"plant" | "recycle">("plant");
  const [completed, setCompleted] = useState(false);

  const progress = ((currentQuestion + 1) / (questions.length + 2)) * 100; // +2 for games

  const handleAnswer = () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === questions[currentQuestion].answer;
    if (correct) {
      setScore(score + 1);
      toast.success("🎉 Correct!");
    } else {
      toast.error("❌ Wrong answer");
    }
    
    setShowResult(true);
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      // Switch to game phase
      setGamePhase("game");
      setGameType("plant");
    }
  };

  const handleGameComplete = (gameScore: number) => {
    const gamePoints = gameScore >= 100 ? 2 : gameScore >= 75 ? 1 : 0;
    setScore(score + gamePoints);
    
    if (gameType === "plant") {
      setGameType("recycle");
    } else {
      // Quiz completed
      setCompleted(true);
      const finalScore = score + gamePoints;
      onComplete(finalScore);
    }
  };

  if (completed) {
    const totalPossible = questions.length + 4; // questions + max game points
    const percentage = (score / totalPossible) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Toaster />
        <Confetti />
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-600">Quiz Completed! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-600 mb-2">Final Score</h3>
              <div className="text-4xl font-bold text-yellow-700">{score}</div>
              <div className="text-sm text-gray-600">out of {totalPossible} points</div>
              <div className="text-lg font-semibold mt-2">
                {percentage >= 80 ? "🥇 Excellent!" : percentage >= 60 ? "🥈 Good Job!" : "🥉 Keep Learning!"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={`/lessons/${courseName}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  🎮 Review Lessons
                </Button>
              </Link>
              <Link href="/Home">
                <Button variant="outline" className="w-full">
                  🏠 More Courses
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" className="w-full">
                  🏆 Leaderboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gamePhase === "game") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Toaster />
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Game Challenge</span>
              <span>{progress.toFixed(0)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <Card className="min-h-[500px]">
            <CardContent className="p-6">
              {gameType === "plant" ? (
                <PlantGame onComplete={handleGameComplete} targetPlants={10} />
              ) : (
                <RecycleGame onComplete={handleGameComplete} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Toaster />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="mt-2 text-right">
            <Badge variant="outline">Score: {score}</Badge>
          </div>
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