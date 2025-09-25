"use client";

import { useState, useEffect } from "react";
import EcoLearnAPI from '@/lib/api';
import { toast } from 'react-hot-toast';

interface LeaderboardEntry {
  _id?: string;
  username?: string;
  name?: string;
  school?: string;
  class?: string;
  totalPoints: number;
  ecoPoints?: number;
  level?: number;
  avatar?: string;
  rank: number;
  studentCount?: number;
  avgPoints?: number;
}

interface UserRanking {
  user: {
    username: string;
    totalPoints: number;
    ecoPoints: number;
    level: number;
    avatar: string;
  };
  rankings: {
    individual: number;
    class: number | null;
    school: number | null;
  };
}

export default function EnhancedLeaderboard() {
  const [activeTab, setActiveTab] = useState<"individual" | "class" | "school">("individual");
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "all-time">("weekly");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ school: '', class: '' });

  // Fallback to localStorage data if API is not available
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab, timeframe, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      await loadLeaderboard();
      await loadUserRanking();
    } catch (error) {
      console.error('API not available, falling back to localStorage:', error);
      setFallbackMode(true);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    const data = await EcoLearnAPI.getLeaderboard(timeframe, activeTab, filters);
    setLeaderboard(data.leaderboard || []);
  };

  const loadUserRanking = async () => {
    const user = EcoLearnAPI.getCurrentUser();
    if (!user) return;

    const ranking = await EcoLearnAPI.getUserRanking(user.id);
    setUserRanking(ranking);
  };

  const loadFallbackData = () => {
    // Use existing localStorage leaderboard as fallback
    try {
      const scores = JSON.parse(localStorage.getItem("ecolearn_scores") || "[]");
      const mockData = scores.map((entry: any, index: number) => ({
        username: entry.username,
        totalPoints: Math.floor(entry.percentage * 10), // Convert percentage to points
        rank: index + 1,
        avatar: '🌱',
        level: Math.floor(entry.percentage / 20) + 1
      }));
      setLeaderboard(mockData);
    } catch (error) {
      console.error('Error loading fallback data:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🏆";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "🏅";
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 2: return "text-gray-600 bg-gray-50 border-gray-200";
      case 3: return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Ranking Card */}
      {userRanking && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{userRanking.user.avatar}</span>
              <div>
                <h3 className="text-xl font-bold">{userRanking.user.username}</h3>
                <p className="text-green-100">Level {userRanking.user.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">#{userRanking.rankings.individual}</div>
              <p className="text-green-100">Global Rank</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-green-400">
            <div className="text-center">
              <div className="text-lg font-bold">#{userRanking.rankings.individual}</div>
              <div className="text-xs text-green-100">Individual</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {userRanking.rankings.class ? `#${userRanking.rankings.class}` : '-'}
              </div>
              <div className="text-xs text-green-100">In Class</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {userRanking.rankings.school ? `#${userRanking.rankings.school}` : '-'}
              </div>
              <div className="text-xs text-green-100">In School</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Category Tabs */}
          <div className="flex space-x-2">
            {[
              { key: 'individual', label: '👤 Individual', icon: '👤' },
              { key: 'class', label: '🏫 Class', icon: '🏫' },
              { key: 'school', label: '🏢 School', icon: '🏢' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Filter */}
          <div className="flex space-x-2">
            {[
              { key: 'daily', label: 'Today' },
              { key: 'weekly', label: 'This Week' },
              { key: 'monthly', label: 'This Month' },
              { key: 'all-time', label: 'All Time' }
            ].map(period => (
              <button
                key={period.key}
                onClick={() => setTimeframe(period.key as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  timeframe === period.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {!fallbackMode && (
          <div className="mt-4 flex space-x-4">
            <input
              type="text"
              placeholder="Filter by school..."
              value={filters.school}
              onChange={(e) => setFilters({ ...filters, school: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Filter by class..."
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            />
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            🏆 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Leaderboard
            {fallbackMode && (
              <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Demo Mode
              </span>
            )}
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No data available</h3>
              <p className="text-gray-600">Complete some eco-tasks to see rankings!</p>
            </div>
          ) : (
            leaderboard.slice(0, 50).map((entry, index) => (
              <div
                key={entry._id || index}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  entry.username === userRanking?.user.username ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getRankColor(entry.rank)}`}>
                      <span className="font-bold">
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{entry.avatar || '🌱'}</span>
                        <h4 className="font-semibold text-gray-800">
                          {entry.username || entry.name}
                          {entry.username === userRanking?.user.username && (
                            <span className="ml-2 text-sm text-green-600">(You)</span>
                          )}
                        </h4>
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        {activeTab === 'individual' && (
                          <>
                            {entry.school && <span>🏫 {entry.school}</span>}
                            {entry.class && <span className="ml-2">📚 {entry.class}</span>}
                          </>
                        )}
                        
                        {activeTab === 'class' && (
                          <span>👥 {entry.studentCount} students • Avg: {entry.avgPoints} pts</span>
                        )}
                        
                        {activeTab === 'school' && (
                          <span>🏢 {entry.studentCount} students • Avg: {entry.avgPoints} pts</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">
                      {entry.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {activeTab === 'individual' ? 'Points' : 'Total Points'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{leaderboard.length}</div>
          <div className="text-sm text-gray-600">Total Participants</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(leaderboard.reduce((sum, entry) => sum + entry.totalPoints, 0) / leaderboard.length) || 0}
          </div>
          <div className="text-sm text-gray-600">Average Points</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.max(...leaderboard.map(entry => entry.totalPoints)) || 0}
          </div>
          <div className="text-sm text-gray-600">Highest Score</div>
        </div>
      </div>
    </div>
  );
}