"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import { saveUserRegistration, updateUserLogin } from "@/utils/userManagement";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.username.trim()) {
        toast.error("Username is required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return false;
      }
    }
    
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required");
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data in localStorage (in a real app, use proper authentication)
      const userData = {
        username: formData.username || formData.email.split("@")[0],
        email: formData.email,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("ecolearn_user", JSON.stringify(userData));
      
      if (isLogin) {
        // Update login time for existing user
        updateUserLogin(userData.username);
        toast.success("Welcome back to EcoLearn!");
      } else {
        // Save new user registration
        saveUserRegistration(userData.username, userData.email);
        toast.success("Welcome to EcoLearn! Let's save the planet together!");
      }
      
      // Both login & signup go to welcome page to see the animation
      setTimeout(() => {
        router.push("/welcome");
      }, 1000);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* Left side - Welcome message and branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Image src="/logo.png" width={60} height={60} alt="EcoLearn Logo" />
              <h1 className="text-4xl font-bold text-green-600 ml-3">EcoLearn</h1>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Join the Environmental Revolution
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Learn about climate change, sustainability, and environmental protection 
              through gamified experiences powered by AI.
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="text-center">
                <Image src="/icons/climate_change.svg" width={50} height={50} alt="Climate" className="mx-auto mb-2" />
                <p className="text-sm text-gray-600">Climate Action</p>
              </div>
              <div className="text-center">
                <Image src="/icons/waste_management.svg" width={50} height={50} alt="Waste" className="mx-auto mb-2" />
                <p className="text-sm text-gray-600">Waste Management</p>
              </div>
              <div className="text-center">
                <Image src="/icons/biodiversity.svg" width={50} height={50} alt="Biodiversity" className="mx-auto mb-2" />
                <p className="text-sm text-gray-600">Biodiversity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <Image src="/logo.png" width={40} height={40} alt="EcoLearn Logo" />
                <h1 className="text-2xl font-bold text-green-600 ml-2">EcoLearn</h1>
              </div>
              
              <CardTitle className="text-2xl text-gray-800">
                {isLogin ? "Welcome Back!" : "Join EcoLearn"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin 
                  ? "Sign in to continue your environmental learning journey" 
                  : "Create your account and start learning about our planet"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? "Please wait..." 
                    : isLogin 
                      ? "Sign In" 
                      : "Create Account"
                  }
                </Button>
                
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="ml-2 text-green-600 hover:text-green-700 font-semibold"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to help protect our environment and learn sustainable practices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}