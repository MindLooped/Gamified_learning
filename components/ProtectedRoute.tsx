"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("ecolearn_user");
      
      if (!userData) {
        router.push("/auth");
        return;
      }
      
      try {
        const parsedUser: UserData = JSON.parse(userData);
        
        // Check if login is still valid (optional: add expiration logic)
        const loginTime = new Date(parsedUser.loginTime);
        const currentTime = new Date();
        const timeDiff = currentTime.getTime() - loginTime.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        
        // Session expires after 24 hours
        if (hoursDiff > 24) {
          localStorage.removeItem("ecolearn_user");
          router.push("/auth");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("ecolearn_user");
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your eco credentials...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}