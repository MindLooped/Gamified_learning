"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RiveHero from "@/components/RiveHero";
import toast, { Toaster } from "react-hot-toast";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function Welcome() {
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
      
      // Show welcome message
      toast.success(`Welcome to EcoLearn, ${parsedUser.username}! 🌱`, {
        duration: 4000,
        icon: '🌍',
      });
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
          <p className="text-gray-600">Preparing your eco journey...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <link
        rel="preload"
        href="/hero_use_case.riv"
        as="fetch"
        crossOrigin="anonymous"
      />
      
      {/* Welcome Message Overlay */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-200">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Welcome to EcoLearn, {user.username}! 🌱
          </h2>
          <p className="text-gray-700 mb-4">
            Get ready to explore environmental science through gamified learning
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>🌍</span>
            <span>Climate Action</span>
            <span>•</span>
            <span>🌿</span>
            <span>Sustainability</span>
            <span>•</span>
            <span>🤖</span>
            <span>AI-Powered</span>
          </div>
        </div>
      </div>

      <main className="block relative w-screen h-screen">
        <RiveHero />
      </main>
    </>
  );
}