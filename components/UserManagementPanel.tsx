"use client";

import { useState, useEffect } from 'react';
import { getAllUsers, UserRegistration } from '@/utils/userManagement';

export default function UserManagementPanel() {
  const [users, setUsers] = useState<UserRegistration[]>([]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ecolearn-users-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearAllUsers = () => {
    if (confirm('⚠️ Are you sure you want to delete ALL user data? This cannot be undone!')) {
      localStorage.removeItem("ecolearn_users");
      localStorage.removeItem("ecolearn_scores");
      setUsers([]);
      alert('All user data has been cleared.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 Registered Users ({users.length})</h2>
        <div className="space-x-2">
          <button
            onClick={exportUsers}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            📥 Export Data
          </button>
          <button
            onClick={clearAllUsers}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No users registered yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Registered</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Last Login</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Quizzes</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{user.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.totalQuizzes}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.averageScore.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Storage Location:</strong> Browser localStorage</p>
        <p><strong>Storage Key:</strong> "ecolearn_users"</p>
        <p><strong>Backup:</strong> Data persists until browser cache is cleared</p>
      </div>
    </div>
  );
}