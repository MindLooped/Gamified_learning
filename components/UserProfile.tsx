"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);

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

  if (!user) {
    return null;
  }

  const joinDate = new Date(user.loginTime).toLocaleDateString();

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <CardTitle className="text-xl text-gray-800">{user.username}</CardTitle>
        <p className="text-gray-600">{user.email}</p>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Image src="/icons/biodiversity.svg" width={20} height={20} alt="Member since" />
            <span className="text-sm text-gray-600">
              Eco-learner since {joinDate}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">0</div>
              <div className="text-xs text-gray-600">Courses Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">0</div>
              <div className="text-xs text-gray-600">Challenges Won</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">0</div>
              <div className="text-xs text-gray-600">Eco Points</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}