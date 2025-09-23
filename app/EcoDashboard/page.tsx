"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import EcoChallenges from "@/components/EcoChallenges";
import styles from "@/styles/home.module.css";

export default function EcoDashboard() {
  const [totalEcoPoints, setTotalEcoPoints] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  useEffect(() => {
    const savedPoints = localStorage.getItem("ecoPoints");
    const savedChallenges = localStorage.getItem("ecoChallenges");
    
    if (savedPoints) {
      setTotalEcoPoints(parseInt(savedPoints));
    }
    
    if (savedChallenges) {
      const challenges = JSON.parse(savedChallenges);
      const completed = challenges.filter((c: any) => c.completed).length;
      setCompletedChallenges(completed);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Link href={"/Home"} className={styles.logobar}>
          <div className={styles.logoText}>🌱 EcoLearn Dashboard</div>
        </Link>
        <div className={`${styles.navitems}`}>
          <Link href="/Home" className={styles.navlist}>
            Courses
          </Link>
          <Link href="/EcoChallenges" className={styles.navlist}>
            Challenges
          </Link>
          <UserButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Eco Points Card */}
          <Card className="p-6 bg-gradient-to-r from-green-400 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">🌱 Eco Points</h3>
            <div className="text-3xl font-bold">{totalEcoPoints}</div>
            <p className="text-sm opacity-90">Points earned from challenges</p>
          </Card>

          {/* Environmental Impact Card */}
          <Card className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
            <h3 className="text-lg font-semibold mb-2">🌍 Impact</h3>
            <div className="text-3xl font-bold">{Math.round(totalEcoPoints * 0.1)} kg</div>
            <p className="text-sm opacity-90">CO₂ emissions saved</p>
          </Card>

          {/* Challenges Completed Card */}
          <Card className="p-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white">
            <h3 className="text-lg font-semibold mb-2">🏆 Achievements</h3>
            <div className="text-3xl font-bold">{completedChallenges}</div>
            <p className="text-sm opacity-90">Challenges completed</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">🚀 Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/Courses/climate_change">
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Learn Climate Science
              </Button>
            </Link>
            <Link href="/Courses/waste_management">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Waste Management
              </Button>
            </Link>
            <Link href="/Courses/energy_conservation">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
                Energy Conservation
              </Button>
            </Link>
            <Link href="/Chat">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Ask EcoChat
              </Button>
            </Link>
          </div>
        </Card>

        {/* Environmental News & Tips */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">🌍 Today's Environmental Tip</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">💡 Did you know?</h4>
            <p className="text-green-700">
              Switching to LED bulbs can reduce your lighting energy consumption by up to 80% 
              compared to traditional incandescent bulbs. A single LED bulb can last 25 times 
              longer and save you money on electricity bills while reducing carbon emissions!
            </p>
            <div className="mt-3">
              <Link href="/Courses/energy_conservation">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Learn More About Energy Conservation
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}