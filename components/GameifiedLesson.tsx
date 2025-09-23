"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "@/components/Confetti";

interface LessonStep {
  id: string;
  type: "story" | "interactive" | "challenge" | "info" | "mini-game";
  title: string;
  content: string;
  image?: string;
  points: number;
  action?: {
    type: "click" | "drag" | "choice" | "input";
    options?: string[];
    correctAnswer?: string;
    question?: string;
  };
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  totalPoints: number;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  steps: LessonStep[];
}

interface GameifiedLessonProps {
  lessonData: LessonData;
  courseName: string;
  onComplete: (score: number) => void;
}

export default function GameifiedLesson({ lessonData, courseName, onComplete }: GameifiedLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [collectedBadges, setCollectedBadges] = useState<string[]>([]);

  const progress = ((currentStep + 1) / lessonData.steps.length) * 100;
  const currentStepData = lessonData.steps[currentStep];

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem(`lesson_${lessonData.id}_progress`);
    if (savedProgress) {
      const { step, score: savedScore, badges } = JSON.parse(savedProgress);
      setCurrentStep(step);
      setScore(savedScore);
      setCollectedBadges(badges || []);
    }
  }, [lessonData.id]);

  const saveProgress = () => {
    const progressData = {
      step: currentStep,
      score,
      badges: collectedBadges,
      lastAccessed: new Date().toISOString()
    };
    localStorage.setItem(`lesson_${lessonData.id}_progress`, JSON.stringify(progressData));
  };

  const handleStepComplete = (earnedPoints: number = 0) => {
    const newScore = score + earnedPoints + currentStepData.points;
    setScore(newScore);

    // Award badges for milestones
    const newBadges = [...collectedBadges];
    if (currentStep === 0 && !newBadges.includes("starter")) {
      newBadges.push("starter");
      toast.success("🎖️ Earned: Lesson Starter Badge!");
    }
    if (currentStep === Math.floor(lessonData.steps.length / 2) && !newBadges.includes("halfway")) {
      newBadges.push("halfway");
      toast.success("🏅 Earned: Halfway Hero Badge!");
    }
    if (earnedPoints > 0 && !newBadges.includes("correct")) {
      newBadges.push("correct");
      toast.success("✅ Earned: Correct Answer Badge!");
    }

    setCollectedBadges(newBadges);

    if (currentStep < lessonData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserAnswer("");
      setShowResult(false);
      saveProgress();
    } else {
      // Lesson completed
      setCompleted(true);
      if (!newBadges.includes("graduate")) {
        newBadges.push("graduate");
        toast.success("🎓 Earned: Lesson Graduate Badge!");
      }
      setCollectedBadges(newBadges);
      
      // Save completion
      const completionData = {
        lessonId: lessonData.id,
        courseName,
        score: newScore,
        totalPoints: lessonData.totalPoints,
        completedAt: new Date().toISOString(),
        badges: newBadges
      };
      
      const completedLessons = JSON.parse(localStorage.getItem("completed_lessons") || "[]");
      completedLessons.push(completionData);
      localStorage.setItem("completed_lessons", JSON.stringify(completedLessons));
      
      onComplete(newScore);
    }
  };

  const handleInteraction = () => {
    // For lessons without actions, just proceed to next step
    handleStepComplete();
  };

  const getBadgeIcon = (badge: string) => {
    const badges = {
      starter: "🌱",
      halfway: "🏅",
      correct: "✅",
      graduate: "🎓",
      explorer: "🔍",
      champion: "🏆"
    };
    return badges[badge as keyof typeof badges] || "🎖️";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Toaster />
        <Confetti />
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-3xl text-green-600">Lesson Completed!</CardTitle>
            <p className="text-gray-600">You've mastered: {lessonData.title}</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-600 mb-2">Final Score</h3>
              <div className="text-4xl font-bold text-yellow-700">{score}</div>
              <div className="text-sm text-gray-600">out of {lessonData.totalPoints} points</div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Badges Earned</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {collectedBadges.map((badge, index) => (
                  <Badge key={index} className="text-lg p-2">
                    {getBadgeIcon(badge)} {badge.charAt(0).toUpperCase() + badge.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={`/Courses/${courseName}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  📝 Take Quiz
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Toaster />
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lessonData.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge className={getDifficultyColor(lessonData.difficulty)}>
                {lessonData.difficulty}
              </Badge>
              <span className="text-sm text-gray-600">⏱️ {lessonData.estimatedTime}</span>
              <span className="text-sm text-gray-600">🎯 {score} points</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {collectedBadges.map((badge, index) => (
              <span key={index} className="text-2xl" title={badge}>
                {getBadgeIcon(badge)}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {currentStep + 1} of {lessonData.steps.length}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStepData.type === "story" && "📖"}
              {currentStepData.type === "interactive" && "🎮"}
              {currentStepData.type === "challenge" && "🎯"}
              {currentStepData.type === "info" && "📚"}
              {currentStepData.type === "mini-game" && "🕹️"}
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStepData.image && (
              <div className="flex justify-center">
                <Image 
                  src={currentStepData.image} 
                  width={200} 
                  height={200} 
                  alt={currentStepData.title}
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700">
              {currentStepData.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleInteraction}
                className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
              >
                {currentStep === lessonData.steps.length - 1 ? "Complete Lesson" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}