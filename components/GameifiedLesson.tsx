"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "@/components/Confetti";

function VideoPlayer({ videoUrl, title }: { videoUrl: string, title: string }) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Add necessary YouTube parameters and ensure embed URL format
  const embedUrl = videoUrl.includes('embed') 
    ? videoUrl 
    : videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
  const enhancedUrl = `${embedUrl}?autoplay=0&rel=0&showinfo=1&modestbranding=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&enablejsapi=1`;

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={enhancedUrl}
        title={title}
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        loading="lazy"
      />
    </div>
  );
}

interface LessonStep {
  id: string;
  type: "story" | "interactive" | "challenge" | "info" | "mini-game" | "video";
  title: string;
  content: string;
  image?: string;
  videoUrl?: string;
  points: number;
  videoQuestions?: {
    time: number;
    question: string;
    options: string[];
    correctAnswer: string;
    points: number;
  }[];
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
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [showVideoQuestion, setShowVideoQuestion] = useState(false);
  const [currentVideoQuestion, setCurrentVideoQuestion] = useState<any>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const progress = ((currentStep + 1) / lessonData.steps.length) * 100;
  const currentStepData = lessonData.steps[currentStep];

  useEffect(() => {
    const savedProgress = localStorage.getItem(`lesson_${lessonData.id}_progress`);
    if (savedProgress) {
      const { step, score: savedScore, badges } = JSON.parse(savedProgress);
      setCurrentStep(step);
      setScore(savedScore);
      setCollectedBadges(badges || []);
    }
  }, [lessonData.id]);

  useEffect(() => {
    if (currentStepData?.type === "video" && currentStepData?.videoQuestions) {
      const interval = setInterval(() => {
        setCurrentVideoTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, currentStepData.type, currentStepData.videoQuestions]);

  useEffect(() => {
    if (currentStepData?.type === "video" && currentStepData?.videoQuestions && !showVideoQuestion) {
      const questionToShow = currentStepData.videoQuestions.find((q, index) => 
        currentVideoTime >= q.time && !answeredQuestions.includes(index)
      );

      if (questionToShow) {
        setCurrentVideoQuestion(questionToShow);
        setShowVideoQuestion(true);
      }
    }
  }, [currentVideoTime, answeredQuestions, showVideoQuestion, currentStepData]);

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
      setCompleted(true);
      if (!newBadges.includes("graduate")) {
        newBadges.push("graduate");
        toast.success("🎓 Earned: Lesson Graduate Badge!");
      }
      setCollectedBadges(newBadges);
      
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

  const handleVideoQuestionAnswer = () => {
    if (!currentVideoQuestion || !userAnswer) return;
    
    setShowResult(true);
    const isCorrect = userAnswer === currentVideoQuestion.correctAnswer;
    
    if (isCorrect) {
      const earnedPoints = currentVideoQuestion.points;
      setScore(prev => prev + earnedPoints);
      toast.success(`🎉 Correct! +${earnedPoints} points earned!`);
    } else {
      toast.error("❌ Incorrect answer. Keep watching and learning!");
    }
    
    const questionIndex = currentStepData.videoQuestions?.findIndex(q => q.time === currentVideoQuestion.time) ?? -1;
    if (questionIndex >= 0) {
      setAnsweredQuestions(prev => [...prev, questionIndex]);
    }
    
    setTimeout(() => {
      setShowVideoQuestion(false);
      setShowResult(false);
      setUserAnswer("");
      setCurrentVideoQuestion(null);
    }, 2000);
  };

  const handleInteraction = () => {
    if (currentStepData.type === "video" && currentStepData.videoQuestions) {
      const allAnswered = answeredQuestions.length >= currentStepData.videoQuestions.length;
      if (!allAnswered) {
        toast.error("Please watch the complete video and answer all questions!");
        return;
      }
    }
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
            <p className="text-gray-600">You&apos;ve mastered: {lessonData.title}</p>
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

      <div className="max-w-4xl mx-auto">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            {currentStepData?.type === "story" && "📖"}
            {currentStepData?.type === "interactive" && "🎮"}
            {currentStepData?.type === "challenge" && "🎯"}
            {currentStepData?.type === "info" && "📚"}
              {currentStepData.type === "mini-game" && "🕹️"}
              {currentStepData.type === "video" && "🎥"}
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStepData.image && (
              <div className="flex justify-center">
                <div className="relative w-[200px] h-[200px]">
                  <Image 
                    src={currentStepData.image} 
                    fill
                    alt={currentStepData.title}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            )}

            {currentStepData.type === "video" && currentStepData.videoUrl && (
              <div className="flex justify-center mb-6">
                <div className="w-full max-w-4xl">
                  <VideoPlayer
                    videoUrl={currentStepData.videoUrl}
                    title={currentStepData.title}
                  />
                  <div className="text-center mt-4 text-sm text-gray-600">
                    📺 Watch carefully - questions will pop up during playback!
                    {currentStepData.videoQuestions && (
                      <div className="mt-2">
                        Questions answered: {answeredQuestions.length} / {currentStepData.videoQuestions.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showVideoQuestion && currentVideoQuestion && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">{currentVideoQuestion.question}</h3>
                  <div className="space-y-2">
                    {currentVideoQuestion.options.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(option)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          userAnswer === option
                            ? "bg-blue-100 border-blue-500"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleVideoQuestionAnswer}
                    disabled={!userAnswer}
                    className="w-full mt-4"
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700">
              {currentStepData.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleInteraction}
                className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
                disabled={currentStepData.type === "video" && currentStepData.videoQuestions && answeredQuestions.length < currentStepData.videoQuestions.length}
              >
                {currentStepData.type === "video" && currentStepData.videoQuestions
                  ? (answeredQuestions.length < currentStepData.videoQuestions.length 
                      ? `Answer Questions (${answeredQuestions.length}/${currentStepData.videoQuestions.length})` 
                      : "Continue to Next Step")
                  : (currentStep === lessonData.steps.length - 1 ? "Complete Lesson" : "Continue")
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
