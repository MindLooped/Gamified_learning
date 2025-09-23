# 🎮 Course-Specific Games Implementation

## Overview
Each environmental course now has its own unique mini-game that relates to the course topic! This makes the learning experience more engaging and contextually relevant.

## Course → Game Mapping

### 🌍 Climate Change → Carbon Footprint Challenge
- **Objective**: Reduce carbon emissions from 100% to 0%
- **Gameplay**: Click on eco-friendly actions (bike to work, LED bulbs, plant trees, etc.)
- **Scoring**: Based on percentage of emissions reduced
- **Theme**: Personal environmental impact

### ⚡ Energy Conservation → Power Saver Challenge  
- **Objective**: Turn off unnecessary devices to save energy
- **Gameplay**: Click to toggle devices on/off (lights, TV, computer, AC, chargers)
- **Scoring**: Based on percentage of energy saved
- **Theme**: Home energy management

### 💧 Water Conservation → Drop Saver Challenge
- **Objective**: Fix water leaks to save water
- **Gameplay**: Click on appearing water leak drops to fix them
- **Scoring**: Based on liters of water saved
- **Theme**: Water waste prevention

### 🌱 Biodiversity → Forest Restoration Game
- **Objective**: Plant trees to restore forest habitat
- **Gameplay**: Click anywhere in the forest area to plant trees
- **Scoring**: Based on number of trees planted (target: 10)
- **Theme**: Ecosystem restoration

### ♻️ Waste Management → Recycling Sorting Game
- **Objective**: Sort waste items into correct recycling bins
- **Gameplay**: Drag waste items to matching bins (plastic, paper, glass, organic)
- **Scoring**: Based on correct sorting accuracy
- **Theme**: Proper waste disposal

### ☀️ Renewable Energy → Solar Energy Farm
- **Objective**: Build solar panels to generate clean energy
- **Gameplay**: Click to place solar panels (max 12), each generates energy over time
- **Scoring**: Based on total energy generated
- **Theme**: Clean energy production

## Game Features

### 🕐 Consistent Mechanics
- **Time Limit**: 30 seconds per game
- **Scoring**: 0-2 points based on performance
- **Visual Feedback**: Progress bars, counters, and success animations
- **Toast Notifications**: Real-time feedback for actions

### 🎯 Scoring Integration
- Quiz questions: 1 point each
- Mini-game: 0-2 points based on performance
- Total possible score: Quiz length + 2 points
- Saved to leaderboard with percentage calculation

### 🎨 Visual Design
- Course-appropriate color schemes
- Emoji-based iconography for universal understanding
- Responsive design for different screen sizes
- Smooth animations and transitions

## Technical Implementation

### 📁 File Structure
```
components/EnhancedQuiz.tsx
├── CarbonGame (Climate Change)
├── EnergyGame (Energy Conservation)  
├── WaterGame (Water Conservation)
├── PlantGame (Biodiversity)
├── RecycleGame (Waste Management)
├── SolarGame (Renewable Energy)
└── getGameForCourse() - Dynamic game selector
```

### 🔄 Game Selection Logic
The `getGameForCourse()` function automatically selects the appropriate game based on the course name:

```typescript
const getGameForCourse = (courseName: string, onComplete: (score: number) => void) => {
  const course = courseName.toLowerCase().replace(/[-\s]/g, '');
  
  switch (course) {
    case 'climatechange': return <CarbonGame onComplete={onComplete} />;
    case 'energyconservation': return <EnergyGame onComplete={onComplete} />;
    case 'waterconservation': return <WaterGame onComplete={onComplete} />;
    case 'biodiversity': return <PlantGame onComplete={onComplete} targetPlants={10} />;
    case 'wastemanagement': return <RecycleGame onComplete={onComplete} />;
    case 'renewableenergy': return <SolarGame onComplete={onComplete} />;
    default: return <CarbonGame onComplete={onComplete} />; // Fallback
  }
};
```

## User Experience Flow

1. **Complete Lesson** → Read educational content about the topic
2. **Start Quiz** → Answer 3-5 multiple choice questions
3. **Play Game** → Engage with course-specific mini-game
4. **View Results** → See combined score from questions + game
5. **Check Leaderboard** → Compare performance with others

## Educational Benefits

### 🧠 Enhanced Learning
- **Contextual Relevance**: Games directly relate to course material
- **Active Engagement**: Hands-on interaction reinforces concepts
- **Immediate Feedback**: Real-time results show understanding
- **Gamified Motivation**: Points and achievements encourage completion

### 📊 Knowledge Retention
- **Multiple Learning Styles**: Visual, interactive, and reading comprehension
- **Practice Application**: Apply concepts in simulated scenarios
- **Memorable Experiences**: Games create lasting impressions
- **Progressive Difficulty**: Building complexity across courses

This implementation transforms each course into a unique, engaging learning experience while maintaining educational integrity! 🌱✨