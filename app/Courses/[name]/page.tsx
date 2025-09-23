"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EnhancedQuiz from "@/components/EnhancedQuiz";
import { getQuizForCourse } from "@/data/quizData";
import { saveUserScore } from "@/utils/userManagement";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const courseName = params.name as string;

  useEffect(() => {
    console.log('🎯 Quiz Page Debug:');
    console.log('  URL param name:', params.name);
    console.log('  courseName:', courseName);
    
    // Check if user is authenticated
    const userData = localStorage.getItem("ecolearn_user");
    if (!userData) {
      router.push("/auth");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth");
      return;
    }

    // Load quiz data for the course
    const quiz = getQuizForCourse(courseName);
    setQuizData(quiz);
    setLoading(false);
  }, [courseName, router]);

  const handleQuizComplete = (finalScore: number) => {
    if (!user) return;

    // Calculate percentage score
    const totalPossible = quizData.length + 4; // questions + max game points
    const percentage = (finalScore / totalPossible) * 100;

    // Save score to localStorage for leaderboard
    saveUserScore(user.username, courseName, percentage, finalScore, totalPossible);

    console.log(`Quiz completed! Score: ${finalScore}/${totalPossible} (${percentage.toFixed(1)}%)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to take quizzes.</p>
          <button
            onClick={() => router.push("/auth")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <EnhancedQuiz
      courseName={courseName}
      questions={quizData}
    />
  );
}
