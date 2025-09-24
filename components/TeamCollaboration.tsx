"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  tasksCompleted: number;
  joinedAt: Date;
  role: 'member' | 'leader' | 'admin';
  achievements: string[];
}

interface Team {
  id: string;
  name: string;
  description: string;
  school: string;
  category: 'class' | 'club' | 'department' | 'school';
  members: TeamMember[];
  totalPoints: number;
  totalTasks: number;
  createdAt: Date;
  goals: TeamGoal[];
  avatar: string;
}

interface TeamGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'trees' | 'plastic' | 'co2' | 'water' | 'tasks';
  deadline: Date;
  reward: number;
  isCompleted: boolean;
}

interface TeamChallengeProps {
  currentUser: TeamMember;
}

export const TeamCollaboration = ({ currentUser }: TeamChallengeProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'goals' | 'leaderboard'>('overview');

  // Mock data for demonstration
  useEffect(() => {
    const mockTeams: Team[] = [
      {
        id: 'team1',
        name: 'Green Warriors',
        description: 'Environmental champions from Computer Science Department',
        school: 'Tech University',
        category: 'department',
        totalPoints: 15420,
        totalTasks: 89,
        createdAt: new Date('2024-01-15'),
        avatar: '🌿',
        members: [
          {
            id: 'user1',
            name: 'Alice Johnson',
            avatar: '👩‍🎓',
            points: 3420,
            level: 8,
            tasksCompleted: 23,
            joinedAt: new Date('2024-01-15'),
            role: 'leader',
            achievements: ['forest_guardian', 'task_master']
          },
          {
            id: 'user2',
            name: 'Bob Smith',
            avatar: '👨‍🎓',
            points: 2890,
            level: 6,
            tasksCompleted: 19,
            joinedAt: new Date('2024-01-20'),
            role: 'member',
            achievements: ['cleanup_starter', 'water_saver']
          },
          {
            id: 'user3',
            name: 'Carol Davis',
            avatar: '👩‍🔬',
            points: 4210,
            level: 9,
            tasksCompleted: 28,
            joinedAt: new Date('2024-01-18'),
            role: 'member',
            achievements: ['ocean_savior', 'consistency_king']
          }
        ],
        goals: [
          {
            id: 'goal1',
            title: 'Plant 100 Trees',
            description: 'Team goal to plant 100 trees by end of semester',
            target: 100,
            current: 67,
            type: 'trees',
            deadline: new Date('2024-05-15'),
            reward: 5000,
            isCompleted: false
          },
          {
            id: 'goal2',
            title: 'Clean 50kg Plastic',
            description: 'Organize campus cleanup drives',
            target: 50,
            current: 50,
            type: 'plastic',
            deadline: new Date('2024-04-01'),
            reward: 3000,
            isCompleted: true
          }
        ]
      },
      {
        id: 'team2',
        name: 'Eco Innovators',
        description: 'Sustainability club focused on innovative solutions',
        school: 'Green Valley College',
        category: 'club',
        totalPoints: 8740,
        totalTasks: 45,
        createdAt: new Date('2024-02-01'),
        avatar: '💡',
        members: [
          {
            id: 'user4',
            name: 'David Wilson',
            avatar: '👨‍💼',
            points: 2840,
            level: 7,
            tasksCompleted: 18,
            joinedAt: new Date('2024-02-01'),
            role: 'leader',
            achievements: ['carbon_warrior']
          }
        ],
        goals: [
          {
            id: 'goal3',
            title: 'Reduce CO₂ by 500kg',
            description: 'Promote cycling and sustainable transport',
            target: 500,
            current: 320,
            type: 'co2',
            deadline: new Date('2024-06-01'),
            reward: 4000,
            isCompleted: false
          }
        ]
      }
    ];

    setTeams(mockTeams);
    setSelectedTeam(mockTeams[0]);
  }, []);

  const getTeamRank = (team: Team) => {
    const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
    return sortedTeams.findIndex(t => t.id === team.id) + 1;
  };

  const getMemberRank = (member: TeamMember, team: Team) => {
    const sortedMembers = [...team.members].sort((a, b) => b.points - a.points);
    return sortedMembers.findIndex(m => m.id === member.id) + 1;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader': return '👑';
      case 'admin': return '⚡';
      default: return '👤';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'class': return '📚';
      case 'club': return '🎯';
      case 'department': return '🏢';
      case 'school': return '🏫';
      default: return '👥';
    }
  };

  if (!selectedTeam) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join or Create a Team</h2>
          <p className="text-gray-600 mb-6">Collaborate with classmates and compete with other teams!</p>
          <div className="space-y-4">
            <Button onClick={() => setShowCreateTeam(true)} size="lg">
              🚀 Create New Team
            </Button>
            <Button variant="outline" size="lg">
              🔍 Browse Teams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Team Header */}
      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">{selectedTeam.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{selectedTeam.name}</h1>
                <p className="text-gray-600">{selectedTeam.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {getCategoryIcon(selectedTeam.category)} {selectedTeam.category.toUpperCase()}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    #{getTeamRank(selectedTeam)} Global Rank
                  </Badge>
                  <span className="text-sm text-gray-600">{selectedTeam.school}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{selectedTeam.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Points</div>
              <div className="text-lg font-semibold text-blue-600 mt-1">{selectedTeam.totalTasks} Tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', name: 'Overview', icon: '📊' },
          { id: 'members', name: 'Members', icon: '👥' },
          { id: 'goals', name: 'Team Goals', icon: '🎯' },
          { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1 flex items-center space-x-2"
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📈</span>
                <span>Team Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTeam.goals.slice(0, 3).map(goal => {
                  const percentage = (goal.current / goal.target) * 100;
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{goal.title}</span>
                        <Badge className={goal.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {goal.isCompleted ? '✅ Done' : `${percentage.toFixed(0)}%`}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {goal.current}/{goal.target} • Reward: {goal.reward} pts
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: 'Carol Davis', action: 'planted 5 trees', time: '2 hours ago', points: 250 },
                  { user: 'Alice Johnson', action: 'cleaned 2kg plastic', time: '5 hours ago', points: 100 },
                  { user: 'Bob Smith', action: 'completed water task', time: '1 day ago', points: 80 },
                  { user: 'Team Goal', action: 'Plastic cleanup completed!', time: '2 days ago', points: 3000 }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{activity.user}</div>
                      <div className="text-sm text-gray-600">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                    <div className="text-green-600 font-semibold">+{activity.points}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTeam.members.map(member => (
            <Card key={member.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-4xl">{member.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      <span className="text-lg">{getRoleIcon(member.role)}</span>
                    </div>
                    <div className="text-sm text-gray-600">Level {member.level}</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    #{getMemberRank(member, selectedTeam)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Points</span>
                    <span className="font-semibold text-green-600">{member.points.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasks</span>
                    <span className="font-semibold">{member.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Achievements</span>
                    <span className="font-semibold text-yellow-600">{member.achievements.length}</span>
                  </div>
                </div>

                {member.achievements.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-600 mb-2">Recent Achievements</div>
                    <div className="flex space-x-1">
                      {member.achievements.slice(0, 3).map((achievement, idx) => (
                        <div key={idx} className="text-lg">🏆</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          {selectedTeam.goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={goal.id} className={goal.isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">+{goal.reward}</div>
                      <div className="text-sm text-gray-600">points reward</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Progress</span>
                      <span className="text-lg font-bold">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {goal.isCompleted ? 'Completed!' : `${daysLeft} days left`}
                      </span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  {goal.isCompleted && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                      <span className="text-green-800 font-medium">🎉 Goal Completed! Team earned {goal.reward} bonus points!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Create New Goal</h3>
              <p className="text-gray-600 mb-4">Set a new challenge for your team</p>
              <Button>Add Team Goal</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Team Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🏆</span>
                <span>Global Team Rankings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teams.sort((a, b) => b.totalPoints - a.totalPoints).map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                      team.id === selectedTeam.id 
                        ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold ${index < 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
                        #{index + 1}
                      </div>
                      <div className="text-3xl">{team.avatar}</div>
                      <div>
                        <div className="font-semibold">{team.name}</div>
                        <div className="text-sm text-gray-600">{team.school}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{team.totalPoints.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{team.members.length} members</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Member Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⭐</span>
                <span>Team Member Rankings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedTeam.members.sort((a, b) => b.points - a.points).map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      member.id === currentUser.id 
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`text-xl font-bold ${index < 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
                        #{index + 1}
                      </div>
                      <div className="text-3xl">{member.avatar}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{member.name}</span>
                          <span>{getRoleIcon(member.role)}</span>
                        </div>
                        <div className="text-sm text-gray-600">Level {member.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{member.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{member.tasksCompleted} tasks</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};