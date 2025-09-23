"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import UserProfile from "@/components/UserProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("ecolearn_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ecolearn_user");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/auth");
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Toaster />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/Home" className="flex items-center">
                  <Image src="/logo.png" width={40} height={40} alt="EcoLearn Logo" />
                  <h1 className="text-2xl font-bold text-green-600 ml-3">EcoLearn</h1>
                </Link>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <Link href="/Home" className="text-gray-700 hover:text-green-600 font-medium">
                  Explore
                </Link>
                <Link href="/Chat" className="text-gray-700 hover:text-green-600 font-medium">
                  EcoChat
                </Link>
                <Link href="/QA" className="text-gray-700 hover:text-green-600 font-medium">
                  EcoQ&A
                </Link>
                <Link href="/leaderboard" className="text-gray-700 hover:text-green-600 font-medium">
                  🏆 Leaderboard
                </Link>
                <Link href="/dashboard" className="text-green-600 font-medium">
                  Dashboard
                </Link>
              </nav>
              
              <div className="flex items-center space-x-4">
                {user && (
                  <span className="text-gray-700 font-medium">
                    Hello, {user.username}!
                  </span>
                )}
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Profile Card */}
            <div className="lg:col-span-1">
              <UserProfile />
            </div>

            {/* Activity Cards */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Welcome Card */}
              <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome to Your Eco Dashboard!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Start your environmental learning journey by exploring our interactive courses and challenges.
                  </p>
                  <Link href="/Home">
                    <Button className="bg-white text-green-600 hover:bg-gray-100">
                      Start Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/Courses/climate_change">
                      <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                        <Image src="/icons/climate_change.svg" width={40} height={40} alt="Climate Change" className="mb-2" />
                        <h3 className="font-semibold text-gray-800">Climate Change</h3>
                        <p className="text-sm text-gray-600">Learn about global warming</p>
                      </div>
                    </Link>
                    
                    <Link href="/Courses/waste_management">
                      <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                        <Image src="/icons/waste_management.svg" width={40} height={40} alt="Waste Management" className="mb-2" />
                        <h3 className="font-semibold text-gray-800">Waste Management</h3>
                        <p className="text-sm text-gray-600">Reduce, reuse, recycle</p>
                      </div>
                    </Link>
                    
                    <Link href="/Chat">
                      <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                        <Image src="/chat.svg" width={40} height={40} alt="EcoChat" className="mb-2" />
                        <h3 className="font-semibold text-gray-800">EcoChat</h3>
                        <p className="text-sm text-gray-600">Ask environmental questions</p>
                      </div>
                    </Link>
                    
                    <Link href="/leaderboard">
                      <div className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                        <div className="text-4xl mb-2">🏆</div>
                        <h3 className="font-semibold text-gray-800">Leaderboard</h3>
                        <p className="text-sm text-gray-600">See your ranking</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Image src="/icons/biodiversity.svg" width={60} height={60} alt="No Activity" className="mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500">No recent activity yet.</p>
                    <p className="text-gray-400 text-sm">Start learning to see your progress here!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}