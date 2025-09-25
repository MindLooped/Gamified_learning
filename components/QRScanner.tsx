"use client";

import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import EcoLearnAPI from '@/lib/api';

interface QRScannerProps {
  onScanSuccess?: (result: any) => void;
  onClose?: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setHasPermission(true);
      setIsScanning(true);
      startScanning();
    } catch (err) {
      console.error('Camera access denied:', err);
      setHasPermission(false);
      setError('Camera access is required to scan QR codes');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    const scanFrame = () => {
      if (!isScanning || !context) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // In a real implementation, you'd use a QR code detection library
        // For now, we'll simulate QR detection
        // You can integrate jsQR or qr-scanner library here
        
        setTimeout(() => {
          if (isScanning) {
            requestAnimationFrame(scanFrame);
          }
        }, 100);
      } else {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  const handleManualEntry = async () => {
    if (!manualCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }

    try {
      await processQRCode(manualCode);
    } catch (error) {
      console.error('Manual QR processing failed:', error);
    }
  };

  const processQRCode = async (qrData: string) => {
    try {
      const user = EcoLearnAPI.getCurrentUser();
      if (!user) {
        toast.error('Please log in to scan QR codes');
        return;
      }

      // Get user location if needed
      const location = await getCurrentLocation();
      
      const result = await EcoLearnAPI.verifyQR(user.id, qrData, location);
      
      if (result.success) {
        toast.success(`🎉 ${result.message}`);
        toast.success(`+${result.pointsAwarded} points awarded!`);
        
        stopCamera();
        onScanSuccess?.(result);
      } else {
        toast.error(result.error || 'QR verification failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process QR code');
    }
  };

  const getCurrentLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve(null);
        },
        { timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📱 Scan QR Code</h3>
          <button
            onClick={() => {
              stopCamera();
              onClose?.();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {hasPermission === null && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📷</div>
            <p className="text-gray-600 mb-4">
              We need camera permission to scan QR codes
            </p>
            <button
              onClick={startCamera}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Enable Camera
            </button>
          </div>
        )}

        {hasPermission === false && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚫</div>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              You can still enter the QR code manually below
            </p>
          </div>
        )}

        {hasPermission === true && (
          <div className="mb-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-48 bg-black rounded-lg object-cover"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-green-500 w-32 h-32 rounded-lg">
                  <div className="w-full h-full border-4 border-transparent rounded-lg animate-pulse">
                    <div className="w-full h-full bg-green-500 bg-opacity-20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-2 text-center">
              Point your camera at the QR code
            </p>
          </div>
        )}

        {/* Manual Entry */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">💬 Manual Entry</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code manually"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleManualEntry}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              ✓
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ask your teacher for the QR code if camera doesn't work
          </p>
        </div>

        {/* Sample QR for Testing */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">🧪 Test QR Code:</p>
          <code className="text-xs bg-white p-2 rounded border block">
            {"ECO-TASK-123-RECYCLE-PLASTIC"}
          </code>
        </div>
      </div>
    </div>
  );
}