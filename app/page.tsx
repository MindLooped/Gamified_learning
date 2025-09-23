"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("ecolearn_user");
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Always show welcome animation for logged-in users
        router.push("/welcome");
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/auth");
      }
    } else {
      // User is not logged in, redirect to auth page
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading EcoLearn...</p>
      </div>
    </div>
  );
}
