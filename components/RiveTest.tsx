"use client";

import { useEffect, useState } from "react";
import { useRive } from "@rive-app/react-canvas";

// Test component to check if Rive works with a different file
export default function RiveTest() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [bearLoaded, setBearLoaded] = useState(false);

  const { rive: heroRive, RiveComponent: HeroComponent } = useRive({
    src: "/hero_use_case.riv",
    autoplay: true,
    onLoad: () => {
      console.log("✅ Hero Rive loaded");
      setHeroLoaded(true);
    },
    onLoadError: (error) => {
      console.error("❌ Hero Rive failed:", error);
    },
  });

  const { rive: bearRive, RiveComponent: BearComponent } = useRive({
    src: "/bear.riv",
    autoplay: true,
    onLoad: () => {
      console.log("✅ Bear Rive loaded");
      setBearLoaded(true);
    },
    onLoadError: (error) => {
      console.error("❌ Bear Rive failed:", error);
    },
  });

  return (
    <div className="w-full h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-4">Rive Animation Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Hero Rive Test */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h2 className="text-lg mb-2">Hero Use Case ({heroLoaded ? "✅ Loaded" : "❌ Failed"})</h2>
          <div className="h-64 bg-black rounded">
            <HeroComponent className="w-full h-full" />
          </div>
        </div>

        {/* Bear Rive Test */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h2 className="text-lg mb-2">Bear Animation ({bearLoaded ? "✅ Loaded" : "❌ Failed"})</h2>
          <div className="h-64 bg-black rounded">
            <BearComponent className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p>Hero Rive Instance: {heroRive ? "Available" : "Null"}</p>
        <p>Bear Rive Instance: {bearRive ? "Available" : "Null"}</p>
      </div>
      
      <a href="/Home" className="mt-4 inline-block bg-blue-600 px-4 py-2 rounded">
        Continue to App
      </a>
    </div>
  );
}