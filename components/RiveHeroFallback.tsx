"use client";

import { useState, useEffect } from "react";

export default function RiveHeroFallback() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 relative w-full h-full overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-green-400 rounded-full opacity-30 animate-float-delay"></div>
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-purple-400 rounded-full opacity-15 animate-float-slow"></div>
      </div>

      {/* Content overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-6xl lg:text-8xl mb-6 animate-bounce">🌍</div>
          <h1
            className="text-white text-5xl lg:text-6xl pb-2 font-bold mb-4"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            EcoLearn
          </h1>
          <p className="text-blue-200 text-lg lg:text-xl mb-8 max-w-md mx-auto">
            Discover environmental science through interactive gaming and learning
          </p>
          
          {/* Interactive button */}
          <div className="relative">
            <a
              href="/Home"
              className="group relative inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-white text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
            >
              <span className="relative z-10">🚀 Start Exploring</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></div>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-blue-200">
            <div className="flex items-center space-x-2">
              <span>🌱</span>
              <span>Interactive Games</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🏆</span>
              <span>Leaderboards</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🎯</span>
              <span>Challenges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}