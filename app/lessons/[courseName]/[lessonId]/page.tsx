"use client";

import { useParams } from "next/navigation";
import GameifiedLesson from "@/components/GameifiedLesson";
import { getLessonsForCourse } from "@/data/lessonData";

export default function LessonPage() {
  const params = useParams();
  const courseName = params.courseName as string;
  const lessonId = params.lessonId as string;

  // Get the lesson data
  const courseLessons = getLessonsForCourse(courseName);
  const lessonData = courseLessons[lessonId];

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-4">The lesson you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/Home" className="text-blue-600 hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  const handleComplete = (score: number) => {
    // Handle lesson completion
    console.log("Lesson completed with score:", score);
  };

  return (
    <GameifiedLesson 
      lessonData={lessonData} 
      courseName={courseName} 
      onComplete={handleComplete}
    />
  );
}