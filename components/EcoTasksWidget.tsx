"use client";

import { useState } from 'react';
import PointsBadgesSystem from './PointsBadgesSystem';
import QRScanner from './QRScanner';
import { toast } from 'react-hot-toast';

export default function EcoTasksWidget() {
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleQRScanSuccess = (result: any) => {
    // Refresh the points display
    window.location.reload();
  };

  const mockEcoTasks = [
    {
      id: 'recycle-plastic',
      title: '♻️ Recycle 5 Plastic Bottles',
      description: 'Collect and recycle 5 plastic bottles at the recycling station',
      points: 50,
      category: 'recycling',
      qrRequired: true
    },
    {
      id: 'plant-seedling',
      title: '🌱 Plant a Seedling',
      description: 'Plant a tree seedling in your school garden',
      points: 100,
      category: 'tree-planting',
      qrRequired: true
    },
    {
      id: 'energy-audit',
      title: '💡 Home Energy Audit',
      description: 'Complete a home energy usage audit',
      points: 75,
      category: 'energy-saving',
      qrRequired: false
    },
    {
      id: 'water-conservation',
      title: '💧 Water Conservation Challenge',
      description: 'Reduce household water usage by 20% this week',
      points: 80,
      category: 'water-conservation',
      qrRequired: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Points & Badges Display */}
      <PointsBadgesSystem />

      {/* Available Eco-Tasks */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">🌍 Available Eco-Tasks</h3>
          <button
            onClick={() => setShowQRScanner(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>📱</span>
            <span>Scan QR</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockEcoTasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{task.title}</h4>
                <div className="flex items-center space-x-1">
                  <span className="text-green-600 font-bold">+{task.points}</span>
                  <span className="text-sm text-gray-500">pts</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.category === 'recycling' ? 'bg-green-100 text-green-800' :
                  task.category === 'tree-planting' ? 'bg-emerald-100 text-emerald-800' :
                  task.category === 'energy-saving' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.category.replace('-', ' ').toUpperCase()}
                </span>
                
                {task.qrRequired ? (
                  <button
                    onClick={() => setShowQRScanner(true)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
                  >
                    📱 Scan to Complete
                  </button>
                ) : (
                  <button
                    onClick={() => toast('Self-verification tasks coming soon!', { icon: 'ℹ️' })}
                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md"
                  >
                    ✅ Self-Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-semibold text-green-800">Daily Challenge</h4>
              <p className="text-sm text-green-700">
                Complete any 2 eco-tasks today for a bonus 25 points!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}