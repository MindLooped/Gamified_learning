const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecolearn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/points', require('./routes/points'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/verification', require('./routes/verification'));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ message: 'EcoLearn Backend is running!', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🌱 EcoLearn Server running on port ${PORT}`);
});