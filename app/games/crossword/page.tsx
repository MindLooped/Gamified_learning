"use client";

import { useRouter } from "next/navigation";
import { EcoCrossword } from "@/components/EcoCrossword";
import toast from "react-hot-toast";

export default function CrosswordPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/Home");
  };

  const handlePointsEarned = (points: number) => {
    toast.success(`Congratulations! You earned ${points} points!`, {
      duration: 3000,
      icon: '🏆',
    });
  };

  return (
    <EcoCrossword onBack={handleBack} onPointsEarned={handlePointsEarned} />
  );
}