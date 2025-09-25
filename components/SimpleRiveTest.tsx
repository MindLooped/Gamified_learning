"use client";

import { useRive } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";

export default function SimpleRiveTest() {
  const [status, setStatus] = useState("Loading...");

  const { rive, RiveComponent } = useRive({
    src: "/hero_use_case.riv",
    autoplay: true,
    onLoad: () => {
      console.log("✅ Simple Rive test: Animation loaded successfully!");
      setStatus("Loaded successfully!");
    },
    onLoadError: (error) => {
      console.error("❌ Simple Rive test: Failed to load:", error);
      setStatus(`Failed to load: ${error || 'Unknown error'}`);
    },
  });

  useEffect(() => {
    console.log("🔍 Simple Rive test initialized");
    console.log("Rive object:", rive);
  }, [rive]);

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Status indicator */}
      <div className="p-4 bg-black text-white text-center">
        <h2>Rive Animation Test</h2>
        <p>Status: {status}</p>
        <p>Rive Instance: {rive ? "Available" : "Not available"}</p>
      </div>
      
      {/* Rive canvas */}
      <div className="flex-1 relative">
        <RiveComponent className="w-full h-full" />
        
        {/* Fallback content */}
        {status.includes("Failed") && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <div className="text-4xl mb-4">❌</div>
              <p>Rive animation failed to load</p>
              <p className="text-sm text-gray-400 mt-2">{status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}