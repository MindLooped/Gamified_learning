"use client";

import { useEffect, useState, MouseEvent, MouseEventHandler } from "react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

import useMediaQuery from "@/utils/useMediaBreakpoint";
import usePrefersReducedMotion from "@/utils/usePrefersReducedMotion";
import { throttle } from "@/utils/throttle";
import RiveButton from "./RiveButton";

// @refresh reset

export default function RiveHero() {
  const [lastWidth, setLastWidth] = useState(0);
  const [lastHeight, setLastHeight] = useState(0);
  const [artboardAttempt, setArtboardAttempt] = useState(0);

  const lgQuery = useMediaQuery("only screen and (min-width: 1025px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Different artboard configurations to try
  const artboardConfigs = [
    { artboard: "New Artboard", stateMachines: "State Machine 1" },
    { artboard: "Hero Demo Listeners Resize", stateMachines: "State Machine 1" },
    { artboard: undefined, stateMachines: "State Machine 1" }, // No artboard specified
    { artboard: undefined, stateMachines: undefined }, // No artboard or state machine
  ];
  
  const currentConfig = artboardConfigs[artboardAttempt] || artboardConfigs[0];
  
  // For now, use the working bear animation until hero_use_case.riv issue is resolved
  const { rive, RiveComponent } = useRive({
    src: "/bear.riv",
    autoplay: true,
    onLoad: () => {
      console.log("✅ Hero animation loaded successfully (using bear.riv)");
    },
    onLoadError: (error) => {
      console.error("❌ Hero animation load error:", error);
    },
  });

  // Pause the animation when the user prefers reduced motion
  useEffect(() => {
    if (rive) {
      prefersReducedMotion ? rive.pause() : rive.play();
    }
  }, [rive, prefersReducedMotion]);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 relative w-full h-full overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Central Rive animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] relative">
          <RiveComponent className="w-full h-full rounded-full border-4 border-blue-400/30 shadow-2xl shadow-blue-500/20" />
          
          {/* Glow effect around animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
        </div>
      </div>
      
      <RiveButton />
    </div>
  );
}
