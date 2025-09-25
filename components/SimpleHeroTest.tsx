"use client";

import { useRive } from "@rive-app/react-canvas";
import { useEffect } from "react";

export default function SimpleHeroTest() {
  // Most basic Rive configuration
  const { rive, RiveComponent } = useRive({
    src: "/hero_use_case.riv",
    artboard: "Hero Demo Listeners Resize", // Use the exact artboard name from file
    autoplay: true,
    onLoad: () => {
      console.log("🎉 Simple hero test loaded successfully!");
      console.log("🎬 Rive instance:", rive);
      
      // Force the animation to play
      setTimeout(() => {
        if (rive) {
          console.log("🔄 Forcing animation restart...");
          rive.reset();
          rive.play();
        }
      }, 1000);
    },
    onLoadError: (error) => {
      console.error("❌ Simple hero test failed:", error);
    }
  });
  
  // Debug effect
  useEffect(() => {
    if (rive) {
      console.log("🎮 Rive animation state:", {
        isPlaying: rive.isPlaying,
        isPaused: rive.isPaused,
      });
    }
  }, [rive]);

  return (
    <div className="w-screen h-screen bg-gray-900 relative">
      <div className="absolute inset-0 w-full h-full">
        <RiveComponent className="w-full h-full" />
      </div>
      
      {/* Debug overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded">
        <h2 className="font-bold">Simple Hero Test</h2>
        <p>Rive Status: {rive ? "✅ Connected" : "❌ Disconnected"}</p>
        <p>File: hero_use_case.riv</p>
        <p>Config: Default (no artboard specified)</p>
      </div>
      
      {/* Navigation */}
      <div className="absolute bottom-4 right-4">
        <a 
          href="/welcome" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Welcome
        </a>
      </div>
    </div>
  );
}