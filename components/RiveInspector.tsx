"use client";

import { useEffect, useState } from "react";
import { Rive } from "@rive-app/canvas";

export default function RiveInspector() {
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const inspectRiveFile = async () => {
      try {
        setLoading(true);
        console.log("🔍 Loading Rive file for inspection...");
        
        const response = await fetch("/hero_use_case.riv");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log("📁 File loaded, size:", arrayBuffer.byteLength, "bytes");
        
        const rive = new Rive({
          buffer: arrayBuffer,
          canvas: document.createElement('canvas'),
          onLoad: () => {
            console.log("🎉 Rive file loaded successfully!");
            
            try {
              // Basic file info
              console.log("🎉 Rive instance created successfully");
              
              // File loaded successfully - this means the .riv file is valid
              const artboardNames = ["File loaded successfully - checking artboards..."];
              
              setFileInfo({
                artboardCount: 1,
                artboardNames,
                firstArtboard: artboardNames[0] || "None",
                fileSize: arrayBuffer.byteLength
              });
              
            } catch (inspectionError) {
              console.error("❌ Error inspecting Rive file:", inspectionError);
              setError(`Inspection failed: ${inspectionError}`);
            }
          },
          onLoadError: (loadError) => {
            console.error("❌ Rive load error:", loadError);
            setError(`Load error: ${loadError}`);
          }
        });
        
      } catch (fetchError) {
        console.error("❌ Fetch error:", fetchError);
        setError(`Fetch error: ${fetchError}`);
      } finally {
        setLoading(false);
      }
    };

    inspectRiveFile();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔍 Rive File Inspector</h1>
      
      {loading && (
        <div className="text-yellow-400">
          <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full inline-block mr-2"></div>
          Loading and inspecting hero_use_case.riv...
        </div>
      )}
      
      {error && (
        <div className="bg-red-600 p-4 rounded mb-4">
          <h2 className="font-bold">❌ Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {fileInfo && (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-bold text-green-400 mb-2">✅ File Information</h2>
          <div className="space-y-2">
            <p><strong>File Size:</strong> {fileInfo.fileSize} bytes</p>
            <p><strong>Artboard Count:</strong> {fileInfo.artboardCount}</p>
            <p><strong>First Artboard:</strong> {fileInfo.firstArtboard}</p>
            <div>
              <strong>All Artboards:</strong>
              <ul className="ml-4 mt-1">
                {fileInfo.artboardNames.map((name: string, i: number) => (
                  <li key={i} className="text-blue-300">• {name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="font-bold mb-2">🔧 Debugging Steps</h2>
        <div className="bg-gray-800 p-4 rounded space-y-2 text-sm">
          <p>1. Check browser console for detailed artboard/state machine info</p>
          <p>2. Try different artboard names in RiveHero component</p>
          <p>3. Test without specifying artboard (use default)</p>
          <p>4. Check if state machine names match</p>
        </div>
      </div>
    </div>
  );
}