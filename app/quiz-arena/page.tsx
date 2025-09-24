"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizArena from "@/components/QuizArena";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function QuizArenaPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
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
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Quiz Arena...</p>
        </div>
      </div>
    );
  }

  const handleModeSelect = (mode: "timed" | "survival" | "challenge" | "multiplayer") => {
    console.log(`Selected mode: ${mode}`);
    // This will be handled by the QuizArena component's navigation
  };

  return <QuizArena onSelectMode={handleModeSelect} />;
}