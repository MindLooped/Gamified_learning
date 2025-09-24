"use client";

import { useRouter } from "next/navigation";
import { EcoDetective } from "@/components/EcoDetective";
import toast from "react-hot-toast";

export default function DetectivePage() {
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
    <EcoDetective onBack={handleBack} onPointsEarned={handlePointsEarned} />
  );
}