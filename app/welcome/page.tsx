"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RiveHero from "@/components/RiveHero";
import RiveHeroFallback from "@/components/RiveHeroFallback";
import SimpleRiveTest from "@/components/SimpleRiveTest";
import RiveTest from "@/components/RiveTest";
import toast, { Toaster } from "react-hot-toast";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function Welcome() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 Welcome page: Checking authentication...");
    
    // Add a small delay to ensure localStorage is available
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("ecolearn_user");
        console.log("👤 User data from localStorage:", userData ? "Found" : "Not found");
        
        if (!userData) {
          console.log("❌ No user data found, creating guest session...");
          // Create a guest user for demo purposes
          const guestUser = {
            username: "Guest",
            email: "guest@ecolearn.com",
            loginTime: new Date().toISOString()
          };
          setUser(guestUser);
          setIsLoading(false);
          return;
        }
        
        const parsedUser = JSON.parse(userData);
        console.log("✅ User authenticated:", parsedUser.username);
        setUser(parsedUser);
        setIsLoading(false);
        
        // Show welcome message
        toast.success(`Welcome to EcoLearn, ${parsedUser.username}! 🌱`, {
          duration: 4000,
          icon: '🌍',
        });
        
        // Add instruction toast
        setTimeout(() => {
          toast.success(`Click "Explore" to start your eco-adventure! 🚀`, {
            duration: 6000,
            icon: '👆',
          });
        }, 2000);
        
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        setIsLoading(false);
        router.push("/auth");
      }
    };
    
    // Check immediately and also after a short delay
    checkAuth();
    const timeoutId = setTimeout(checkAuth, 100);
    
    // Fallback timeout - if still loading after 3 seconds, redirect to auth
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("⏰ Loading timeout reached, redirecting to auth...");
        setIsLoading(false);
        router.push("/auth");
      }
    }, 3000);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(fallbackTimeout);
    };
  }, [router]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your eco journey...</p>
          <p className="text-sm text-gray-500 mt-2">
            {isLoading ? "Loading..." : "Redirecting..."}
          </p>
          
          {/* Add a skip button as fallback */}
          <button 
            onClick={() => router.push("/auth")}
            className="mt-4 text-sm text-green-600 hover:text-green-700 underline"
          >
            Click here if this takes too long
          </button>
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
            <span>🎮</span>
            <span>Interactive Games</span>
          </div>
        </div>
      </div>

      <main className="block relative w-screen h-screen">
        <RiveHero />
      </main>
    </>
  );
}