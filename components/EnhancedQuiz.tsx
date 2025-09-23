"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "@/components/Confetti";
import BeginnerFriendlyQuiz from "@/components/BeginnerFriendlyQuiz";

interface QuizProps {
  courseName: string;
  questions: any[];
}

export default function EnhancedQuiz({ courseName, questions }: QuizProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  console.log('🎯 EnhancedQuiz Debug:');
  console.log('  Course Name:', courseName);
  console.log('  Questions Count:', questions?.length || 0);

  const handleQuizComplete = (score: number) => {
    console.log('📊 Quiz completed with score:', score);
    
    const maxPossibleScore = (questions?.length || 0) + 2;
    const percentage = (score / maxPossibleScore) * 100;
    
    if (percentage >= 70) {
      setShowConfetti(true);
      toast.success('🎉 Excellent performance! You have mastered this topic!');
    } else if (percentage >= 50) {
      toast.success('👏 Good job! Keep learning and improving!');
    } else {
      toast.success('📚 Nice try! Review the materials and try again!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}
      
      <BeginnerFriendlyQuiz 
        courseName={courseName}
        questions={questions}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
