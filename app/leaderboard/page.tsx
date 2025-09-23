"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

interface LeaderboardEntry {
  id: string;
  username: string;
  course: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  medal: string;
}

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const courses = [
    { id: "all", name: "All Courses", icon: "🌍" },
    { id: "climate_change", name: "Climate Change", icon: "🌡️" },
    { id: "waste_management", name: "Waste Management", icon: "♻️" },
    { id: "energy_conservation", name: "Energy Conservation", icon: "⚡" },
    { id: "water_conservation", name: "Water Conservation", icon: "💧" },
    { id: "biodiversity", name: "Biodiversity", icon: "🌿" }
  ];

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("ecolearn_user");
    if (!userData) {
      router.push("/auth");
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth");
      return;
    }

    // Load leaderboard data
    loadLeaderboard();
  }, [router, selectedCourse]);

  const loadLeaderboard = () => {
    setLoading(true);
    try {
      const scores = JSON.parse(localStorage.getItem("ecolearn_scores") || "[]");
      
      // Filter by course if selected
      let filteredScores = scores;
      if (selectedCourse !== "all") {
        filteredScores = scores.filter((entry: LeaderboardEntry) => entry.course === selectedCourse);
      }
      
      // Sort by percentage (descending), then by completion time (ascending)
      filteredScores.sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      });
      
      setLeaderboard(filteredScores);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      toast.error("Failed to load leaderboard data");
    }
    setLoading(false);
  };

  const getMedalIcon = (medal: string) => {
    switch (medal) {
      case "gold": return "🥇";
      case "silver": return "🥈";
      case "bronze": return "🥉";
      default: return "🏅";
    }
  };

  const getMedalColor = (medal: string) => {
    switch (medal) {
      case "gold": return "text-yellow-600 bg-yellow-50";
      case "silver": return "text-gray-600 bg-gray-50";
      case "bronze": return "text-orange-600 bg-orange-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "👑";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ecolearn_user");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/auth");
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
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
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 font-medium">
                Dashboard
              </Link>
              <Link href="/leaderboard" className="text-green-600 font-medium">
                Leaderboard
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Hello, {user.username}!</span>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            🏆 EcoLearn Leaderboard
          </h1>
          <p className="text-center text-gray-600">
            See how you rank among environmental champions!
          </p>
        </div>

        {/* Course Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Filter by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedCourse === course.id
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{course.icon}</div>
                  <div className="text-sm font-medium">{course.name}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center">
              🌟 Rankings
              {selectedCourse !== "all" && (
                <span className="ml-2 text-lg text-green-600">
                  - {courses.find(c => c.id === selectedCourse)?.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading rankings...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No scores yet!</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to complete a quiz and claim your spot on the leaderboard.
                </p>
                <Link href="/Home">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Start Learning
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      entry.username === user.username
                        ? "bg-green-50 border-green-300 shadow-md"
                        : "bg-white border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-700 min-w-[60px]">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-800">
                            {entry.username}
                            {entry.username === user.username && (
                              <span className="ml-2 text-sm text-green-600 font-medium">(You)</span>
                            )}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMedalColor(entry.medal)}`}>
                            {getMedalIcon(entry.medal)} {entry.medal.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">
                            {courses.find(c => c.id === entry.course)?.name || entry.course}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            Completed on {new Date(entry.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {entry.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.score}/{entry.totalQuestions} correct
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Link href="/Home">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Take More Quizzes
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                View Dashboard
              </Button>
            </Link>
            <Link href="/Chat">
              <Button variant="outline" className="w-full">
                Ask EcoChat
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}