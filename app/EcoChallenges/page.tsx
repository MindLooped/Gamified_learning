"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import EcoChallenges from "@/components/EcoChallenges";
import { Toaster } from "react-hot-toast";
import styles from "@/styles/home.module.css";

export default function EcoChallengesPage() {
  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.navbar}>
        <Link href={"/Home"} className={styles.logobar}>
          <div className={styles.logoText}>🌱 EcoLearn</div>
        </Link>
        <div className={`${styles.navitems}`}>
          <Link href="/Home" className={styles.navlist}>
            Courses
          </Link>
          <Link href="/EcoDashboard" className={styles.navlist}>
            Dashboard
          </Link>
          <Link href="/leaderboard" className={styles.navlist}>
            🏆 Leaderboard
          </Link>
          <UserButton />
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            <Link href="/Contact">Green Connect</Link>
          </button>
        </div>
      </div>

      <div className="mt-20">
        <EcoChallenges />
      </div>
    </div>
  );
}