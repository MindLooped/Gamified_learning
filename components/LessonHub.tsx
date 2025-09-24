"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getLessonsForCourse } from "@/data/lessonData";

interface LessonCardProps {
  lessonId: string;
  lessonData: any;
  courseName: string;
}

const LessonCard = ({ lessonId, lessonData, courseName }: LessonCardProps) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Check lesson progress from localStorage
    const savedProgress = localStorage.getItem(`lesson_${lessonId}_progress`);
    const completedLessons = JSON.parse(localStorage.getItem("completed_lessons") || "[]");
    
    const completed = completedLessons.find((lesson: any) => 
      lesson.lessonId === lessonId && lesson.courseName === courseName
    );

    if (completed) {
      setIsCompleted(true);
      setProgress(100);
      setScore(completed.score);
    } else if (savedProgress) {
      const { step } = JSON.parse(savedProgress);
      const progressPercent = ((step + 1) / lessonData.steps.length) * 100;
      setProgress(progressPercent);
    }
  }, [lessonId, courseName, lessonData.steps.length]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl">{lessonData.title}</CardTitle>
          {isCompleted && <span className="text-2xl">✅</span>}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getDifficultyColor(lessonData.difficulty)}>
            {lessonData.difficulty}
          </Badge>
          <Badge variant="outline">⏱️ {lessonData.estimatedTime}</Badge>
          <Badge variant="outline">🎯 {lessonData.totalPoints} points</Badge>
        </div>

        <p className="text-gray-600 text-sm">{lessonData.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {progress > 0 && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-green-700 font-semibold">Completed!</div>
              <div className="text-green-600">Score: {score}/{lessonData.totalPoints}</div>
            </div>
          )}

          <div className="flex gap-2">
            <Link href={`/lessons/${courseName}/${lessonId}`} className="flex-1">
              <Button className="w-full">
                {progress > 0 && !isCompleted ? "Continue" : isCompleted ? "Replay" : "Start"} Lesson
              </Button>
            </Link>
            
            {isCompleted && (
              <Link href={`/Courses/${courseName}`}>
                <Button variant="outline">
                  Take Quiz
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface LessonHubProps {
  courseName: string;
}

export default function LessonHub({ courseName }: LessonHubProps) {
  const [userStats, setUserStats] = useState({ totalPoints: 0, completedLessons: 0 });

  useEffect(() => {
    // Calculate user stats for this course
    const completedLessons = JSON.parse(localStorage.getItem("completed_lessons") || "[]");
    const courseCompletions = completedLessons.filter((lesson: any) => lesson.courseName === courseName);
    
    // Get lesson points
    const lessonPoints = courseCompletions.reduce((sum: number, lesson: any) => sum + lesson.score, 0);
    
    // Get quiz points for this course
    const quizScores = JSON.parse(localStorage.getItem("ecolearn_scores") || "[]");
    const courseQuizScores = quizScores.filter((score: any) => score.course === courseName);
    const quizPoints = courseQuizScores.reduce((sum: number, score: any) => sum + score.score, 0);
    
    // Combine both lesson and quiz points
    const totalPoints = lessonPoints + quizPoints;
    
    setUserStats({
      totalPoints,
      completedLessons: courseCompletions.length
    });
  }, [courseName]);

  // Get lessons for the current course
  const lessons = getLessonsForCourse(courseName);
  
  const getCourseTitle = (courseName: string) => {
    const titles: Record<string, string> = {
      "climate_change": "Climate Change",
      "renewable_energy": "Renewable Energy",
      "sustainable_living": "Sustainable Living",
      "conservation": "Conservation",
      "green_technology": "Green Technology"
    };
    return titles[courseName] || courseName.replace("_", " ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {getCourseTitle(courseName)} Lessons
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Interactive lessons to master environmental concepts through gamified learning
          </p>
          
          {/* User Stats */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{userStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{userStats.completedLessons}</div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(lessons).length}</div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(lessons).map(([lessonId, lessonData]) => (
            <LessonCard
              key={lessonId}
              lessonId={lessonId}
              lessonData={lessonData}
              courseName={courseName}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/Home">
            <Button variant="outline" size="lg">
              🏠 Back to Courses
            </Button>
          </Link>
          <Link href={`/Courses/${courseName}`}>
            <Button variant="outline" size="lg">
              📝 Take Course Quiz
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline" size="lg">
              🏆 View Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}