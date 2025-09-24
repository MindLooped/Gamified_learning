"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "@/components/Confetti";

interface SpeedChallengeProps {
  courseName: string;
  questions: any[];
  onComplete: (score: number) => void;
}

export default function SpeedChallenge({ courseName, questions, onComplete }: SpeedChallengeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Countdown timer
  useEffect(() => {
    if (gameActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      // Time's up - auto-submit with no answer
      handleAnswer(true);
    }
  }, [timeLeft, gameActive, showResult]);

  const startGame = () => {
    setGameActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(15);
    setShowResult(false);
    setSelectedAnswer("");
  };

  const handleAnswer = (timeUp = false) => {
    if (showResult) return;

    const isCorrect = !timeUp && selectedAnswer === questions[currentQuestion].answer;
    
    if (isCorrect) {
      const basePoints = 10;
      let bonus = 0;
      
      // Speed bonus based on time left
      if (timeLeft > 10) bonus = 15;
      else if (timeLeft > 5) bonus = 10;
      else if (timeLeft > 2) bonus = 5;
      
      // Streak bonus
      const streakMultiplier = Math.min(streak + 1, 5);
      const totalPoints = basePoints + bonus;
      const finalPoints = totalPoints * streakMultiplier;
      
      setScore(prev => prev + finalPoints);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setSpeedBonus(bonus);
      
      toast.success(`🎯 Correct! +${finalPoints}pts (${streakMultiplier}x streak bonus)`);
    } else {
      setStreak(0);
      setSpeedBonus(0);
      
      if (timeUp) {
        toast.error("⏰ Time's up! Moving to next question");
      } else {
        toast.error(`❌ Wrong! Answer: ${questions[currentQuestion].answer}`);
      }
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion === questions.length - 1) {
        // Game complete
        setGameComplete(true);
        if (score > questions.length * 8) {
          setShowConfetti(true);
        }
        onComplete(score);
      } else {
        // Next question
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer("");
        setShowResult(false);
        setTimeLeft(15);
      }
    }, 2000);
  };

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <Toaster />
        
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-4xl text-red-700 mb-4">
                ⚡ Speed Challenge: {courseName}
              </CardTitle>
              <p className="text-lg text-gray-600">
                Answer questions as fast as you can! Faster answers = higher scores!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-100 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">15s</div>
                  <div className="text-sm text-red-600">Per Question</div>
                </div>
                <div className="p-4 bg-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">5x</div>
                  <div className="text-sm text-orange-600">Max Streak Multiplier</div>
                </div>
                <div className="p-4 bg-yellow-100 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">+15</div>
                  <div className="text-sm text-yellow-600">Max Speed Bonus</div>
                </div>
              </div>

              <div className="space-y-4 text-left max-w-md mx-auto">
                <h3 className="font-bold text-lg">🏆 Scoring System:</h3>
                <div className="space-y-2 text-sm">
                  <div>📍 Base Points: 10 per correct answer</div>
                  <div>⚡ Speed Bonus: +15 (&gt;10s), +10 (&gt;5s), +5 (&gt;2s)</div>
                  <div>🔥 Streak Multiplier: Up to 5x for consecutive correct answers</div>
                  <div>⏰ Time Penalty: 0 points if time runs out</div>
                </div>
              </div>

              <Button 
                onClick={startGame}
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3"
              >
                🚀 Start Speed Challenge!
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const maxPossibleScore = questions.length * 25 * 5; // Max points with perfect speed and streak
    const percentage = (score / maxPossibleScore) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <Toaster />
        {showConfetti && <Confetti />}
        
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-3xl text-red-700">⚡ Speed Challenge Complete!</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-6xl mb-4">
                {percentage > 80 ? "🏆" : percentage > 60 ? "🥈" : percentage > 40 ? "🥉" : "⭐"}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-red-100 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{score}</div>
                  <div className="text-sm text-red-600">Total Score</div>
                </div>
                <div className="p-4 bg-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">{maxStreak}</div>
                  <div className="text-sm text-orange-600">Best Streak</div>
                </div>
                <div className="p-4 bg-yellow-100 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">{percentage.toFixed(1)}%</div>
                  <div className="text-sm text-yellow-600">Performance</div>
                </div>
                <div className="p-4 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {questions.filter((_, i) => i <= currentQuestion).length}
                  </div>
                  <div className="text-sm text-green-600">Questions</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={startGame}
                  className="bg-red-600 hover:bg-red-700"
                >
                  🔄 Try Again
                </Button>
                <Link href="/quiz-arena">
                  <Button variant="outline" className="border-red-600 text-red-600">
                    🏟️ Back to Arena
                  </Button>
                </Link>
                <Link href="/Home">
                  <Button variant="outline" className="border-green-600 text-green-600">
                    🏠 Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main game interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Toaster />
      
      <div className="max-w-4xl mx-auto">
        {/* Header with stats */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-100">
                Question {currentQuestion + 1}/{questions.length}
              </Badge>
              <Badge variant="outline" className="bg-orange-100">
                Score: {score}
              </Badge>
              <Badge variant="outline" className="bg-yellow-100">
                Streak: {streak} 🔥
              </Badge>
            </div>
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
              ⏰ {timeLeft}s
            </div>
          </div>
          <Progress value={progress} className="h-2" />
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
                      ? "bg-red-100 border-red-500 text-red-700" 
                      : "bg-white border-gray-200 hover:border-red-300"
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
                  ? `✅ Correct! Speed bonus: +${speedBonus} | Streak: ${streak}x` 
                  : `❌ Wrong. Correct answer: ${questions[currentQuestion].answer}`
                }
              </div>
            )}

            <div className="flex justify-center pt-6">
              <Button
                onClick={() => handleAnswer()}
                disabled={!selectedAnswer || showResult}
                className="px-8 py-3 text-lg bg-red-600 hover:bg-red-700"
              >
                {timeLeft <= 5 ? "🔥 HURRY!" : "⚡ Submit Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}