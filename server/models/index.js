const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'ngo'], default: 'student' },
  school: { type: String },
  class: { type: String },
  ecoPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  badges: [{ 
    id: String, 
    name: String, 
    icon: String, 
    earnedAt: { type: Date, default: Date.now }
  }],
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date },
  avatar: { type: String, default: '🌱' },
  createdAt: { type: Date, default: Date.now }
});

// Eco Task Schema
const EcoTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['recycling', 'energy-saving', 'water-conservation', 'tree-planting', 'pollution-reduction'],
    required: true 
  },
  points: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  verificationMethod: { 
    type: String, 
    enum: ['qr-code', 'photo', 'teacher-verify', 'quiz'],
    required: true 
  },
  qrCode: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Task Completion Schema
const TaskCompletionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'EcoTask', required: true },
  completedAt: { type: Date, default: Date.now },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evidence: {
    type: { type: String, enum: ['photo', 'qr-scan', 'quiz-result'] },
    data: String, // Base64 image or QR data
    metadata: mongoose.Schema.Types.Mixed
  },
  pointsAwarded: { type: Number, default: 0 },
  feedback: { type: String }
});

// Leaderboard Schema
const LeaderboardSchema = new mongoose.Schema({
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'all-time'], required: true },
  category: { type: String, enum: ['individual', 'class', 'school'], required: true },
  rankings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    school: { type: String },
    class: { type: String },
    points: { type: Number },
    rank: { type: Number }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  EcoTask: mongoose.model('EcoTask', EcoTaskSchema),
  TaskCompletion: mongoose.model('TaskCompletion', TaskCompletionSchema),
  Leaderboard: mongoose.model('Leaderboard', LeaderboardSchema)
};