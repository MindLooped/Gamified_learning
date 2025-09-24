"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/home.module.css";
import { cn } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import { Typewriter } from "react-simple-typewriter";

interface UserData {
  username: string;
  email: string;
  loginTime: string;
}

export default function Home() {
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
      toast.success(`Welcome back, ${parsedUser.username}!`);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth");
    }
  }, [router]);

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
          <p className="text-gray-600">Loading your eco journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.navbar}>
        <Link href={"/Home"} className={styles.logobar}>
          <Image src="/logo.png" width={40} height={40} alt="logo" />
          <div className={styles.logoText}>EcoLearn</div>
        </Link>
        <div className={`${styles.navitems}`}>
          <Link href="/Imagen" className={styles.navlist}>
            EcoVision
          </Link>
          <Link href="/QA" className={styles.navlist}>
            EcoQ&A
          </Link>
          <Link href="/Chat" className={styles.navlist}>
            EcoChat
          </Link>
          <Link href="/Rekog" className={styles.navlist}>
            EcoRekog
          </Link>
          <Link href="/leaderboard" className={styles.navlist}>
            🏆 Leaderboard
          </Link>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            <Link href="/Contact">Green Connect</Link>
          </button>
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="text-green-600 hover:text-green-700 font-semibold">
              Dashboard
            </Link>
            <span className="text-green-600 font-semibold">Hello, {user.username}!</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className={`${styles.herosection} mt-20`}>
        <div className={styles.herocontent}>
          <div className={styles.heroheading}>
            <h1 className={styles.h1}>
              <Typewriter
                words={["What is EcoLearn", "Environmental Education", "AI Powered", "Save Our Planet"]}
                loop={1000}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
          </div>
          <div className={styles.wrapper}>
            <p className={`${styles.heroheading} ${styles.p}`}>
              EcoLearn is a gamified platform where students learn about environmental science, 
              sustainability, and climate action. Make learning about our planet as engaging as gaming 
              with AI-powered tools and real-world environmental challenges.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/lessons/climate_change">
                <button className={`${styles.btnpink} bg-blue-600 hover:bg-blue-700`}>
                  🎮 Interactive Lessons
                </button>
              </Link>
              <Link href="/Courses/climate_change">
                <button className={styles.btnpink}>
                  📝 Take Quizzes
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className={cn(`grid grid-cols-2 lg:grid-cols-3 gap-6 p-6 ${styles.heroimg}`)}>
          {/* Climate Change */}
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <Image
                src="/icons/climate_change.svg"
                width={80}
                height={80}
                alt="climate change"
                className="mx-auto mb-3 transition ease-in-out duration-500 hover:scale-110"
              />
              <h3 className="font-semibold text-gray-800 mb-3">Climate Change</h3>
              <div className="flex flex-col gap-2">
                <Link href="/lessons/climate_change">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm">
                    🎮 Lessons
                  </button>
                </Link>
                <Link href="/Courses/climate_change">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm">
                    📝 Quiz
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Waste Management */}
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <Image
                src="/icons/waste_management.svg"
                width={80}
                height={80}
                alt="waste management"
                className="mx-auto mb-3 transition ease-in-out duration-500 hover:scale-110"
              />
              <h3 className="font-semibold text-gray-800 mb-3">Waste Management</h3>
              <div className="flex flex-col gap-2">
                <Link href="/lessons/waste_management">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm">
                    🎮 Lessons
                  </button>
                </Link>
                <Link href="/Courses/waste_management">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm">
                    📝 Quiz
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Water Conservation */}
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <Image
                src="/icons/water_conservation.svg"
                width={80}
                height={80}
                alt="water conservation"
                className="mx-auto mb-3 transition ease-in-out duration-500 hover:scale-110"
              />
              <h3 className="font-semibold text-gray-800 mb-3">Water Conservation</h3>
              <div className="flex flex-col gap-2">
                <Link href="/lessons/water_conservation">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm">
                    🎮 Lessons
                  </button>
                </Link>
                <Link href="/Courses/water_conservation">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm">
                    📝 Quiz
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Biodiversity */}
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <Image
                src="/icons/biodiversity.svg"
                width={80}
                height={80}
                alt="biodiversity"
                className="mx-auto mb-3 transition ease-in-out duration-500 hover:scale-110"
              />
              <h3 className="font-semibold text-gray-800 mb-3">Biodiversity</h3>
              <div className="flex flex-col gap-2">
                <Link href="/lessons/biodiversity">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm">
                    🎮 Lessons
                  </button>
                </Link>
                <Link href="/Courses/biodiversity">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm">
                    📝 Quiz
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Renewable Energy */}
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <Image
                src="/icons/azure.svg"
                width={80}
                height={80}
                alt="renewable energy"
                className="mx-auto mb-3 transition ease-in-out duration-500 hover:scale-110"
              />
              <h3 className="font-semibold text-gray-800 mb-3">Renewable Energy</h3>
              <div className="flex flex-col gap-2">
                <Link href="/lessons/renewable_energy">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm">
                    🎮 Lessons
                  </button>
                </Link>
                <Link href="/Courses/renewable_energy">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm">
                    📝 Quiz
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
