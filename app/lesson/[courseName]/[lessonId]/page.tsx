"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GameifiedLesson from "@/components/GameifiedLesson";
import { getLessonsForCourse } from "@/data/lessonData";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const courseName = params.courseName as string;
  const lessonId = params.lessonId as string;

  useEffect(() => {
    // Get lesson data based on course and lesson ID
    const lessons = getLessonsForCourse(courseName);
    
    if (lessons[lessonId as keyof typeof lessons]) {
      setLessonData(lessons[lessonId as keyof typeof lessons]);
    } else {
      // Lesson not found, redirect to course page
      router.push(`/lessons/${courseName}`);
      return;
    }
    
    setLoading(false);
  }, [courseName, lessonId, router]);

  const handleLessonComplete = (score: number) => {
    // Save lesson completion
    const completionData = {
      lessonId,
      courseName,
      score,
      completedAt: new Date().toISOString()
    };
    
    // You can add additional logic here like updating user progress
    console.log("Lesson completed:", completionData);
    
    // Redirect to lessons hub after a delay
    setTimeout(() => {
      router.push(`/lessons/${courseName}`);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">The requested lesson could not be found.</p>
          <button
            onClick={() => router.push(`/lessons/${courseName}`)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameifiedLesson
      lessonData={lessonData}
      courseName={courseName}
      onComplete={handleLessonComplete}
    />
  );
}