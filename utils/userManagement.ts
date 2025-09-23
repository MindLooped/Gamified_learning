// User Management Utilities for EcoLearn Platform

export interface UserRegistration {
  id: string;
  username: string;
  email: string;
  registeredAt: string;
  lastLogin: string;
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
}

export interface QuizScore {
  id: string;
  username: string;
  course: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  medal: string;
  completedAt: string;
}

// Save user registration
export const saveUserRegistration = (username: string, email: string): void => {
  try {
    const existingUsers = JSON.parse(localStorage.getItem("ecolearn_users") || "[]");
    
    // Check if user already exists
    const existingUser = existingUsers.find((user: UserRegistration) => 
      user.username === username || user.email === email
    );
    
    if (!existingUser) {
      const newUser: UserRegistration = {
        id: `user_${Date.now()}`,
        username,
        email,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalQuizzes: 0,
        totalScore: 0,
        averageScore: 0
      };
      
      existingUsers.push(newUser);
      localStorage.setItem("ecolearn_users", JSON.stringify(existingUsers));
    }
  } catch (error) {
    console.error("Error saving user registration:", error);
  }
};

// Update user login time
export const updateUserLogin = (username: string): void => {
  try {
    const existingUsers = JSON.parse(localStorage.getItem("ecolearn_users") || "[]");
    const userIndex = existingUsers.findIndex((user: UserRegistration) => user.username === username);
    
    if (userIndex !== -1) {
      existingUsers[userIndex].lastLogin = new Date().toISOString();
      localStorage.setItem("ecolearn_users", JSON.stringify(existingUsers));
    }
  } catch (error) {
    console.error("Error updating user login:", error);
  }
};

// Save quiz score
export const saveUserScore = (
  username: string, 
  course: string, 
  percentage: number, 
  score: number, 
  totalQuestions: number
): void => {
  try {
    const existingScores = JSON.parse(localStorage.getItem("ecolearn_scores") || "[]");
    
    // Determine medal based on percentage
    let medal = "bronze";
    if (percentage >= 70) medal = "gold";
    else if (percentage >= 40) medal = "silver";
    
    const newScore: QuizScore = {
      id: `score_${Date.now()}`,
      username,
      course,
      score,
      totalQuestions,
      percentage,
      medal,
      completedAt: new Date().toISOString()
    };
    
    existingScores.push(newScore);
    localStorage.setItem("ecolearn_scores", JSON.stringify(existingScores));
    
    // Update user statistics
    updateUserStats(username);
  } catch (error) {
    console.error("Error saving quiz score:", error);
  }
};

// Update user statistics after quiz completion
const updateUserStats = (username: string): void => {
  try {
    const users = JSON.parse(localStorage.getItem("ecolearn_users") || "[]");
    const userIndex = users.findIndex((user: UserRegistration) => user.username === username);
    
    if (userIndex !== -1) {
      const scores = JSON.parse(localStorage.getItem("ecolearn_scores") || "[]");
      const userScores = scores.filter((score: QuizScore) => score.username === username);
      
      users[userIndex].totalQuizzes = userScores.length;
      users[userIndex].totalScore = userScores.reduce((sum: number, score: QuizScore) => sum + score.percentage, 0);
      users[userIndex].averageScore = users[userIndex].totalQuizzes > 0 ? 
        users[userIndex].totalScore / users[userIndex].totalQuizzes : 0;
      
      localStorage.setItem("ecolearn_users", JSON.stringify(users));
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
};

// Get all registered users
export const getAllUsers = (): UserRegistration[] => {
  try {
    return JSON.parse(localStorage.getItem("ecolearn_users") || "[]");
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Get user statistics
export const getUserStats = (username: string): UserRegistration | null => {
  try {
    const users = getAllUsers();
    const scores = JSON.parse(localStorage.getItem("ecolearn_scores") || "[]");
    
    const user = users.find((u: UserRegistration) => u.username === username);
    if (!user) return null;
    
    // Calculate stats from quiz scores
    const userScores = scores.filter((score: QuizScore) => score.username === username);
    const totalQuizzes = userScores.length;
    const totalScore = userScores.reduce((sum: number, score: QuizScore) => sum + score.percentage, 0);
    const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
    
    return {
      ...user,
      totalQuizzes,
      totalScore,
      averageScore
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

// Get leaderboard data
export const getLeaderboardData = (courseFilter: string = "all"): QuizScore[] => {
  try {
    const scores = JSON.parse(localStorage.getItem("ecolearn_scores") || "[]");
    
    let filteredScores = scores;
    if (courseFilter !== "all") {
      filteredScores = scores.filter((score: QuizScore) => score.course === courseFilter);
    }
    
    // Sort by percentage (descending), then by completion time (ascending)
    return filteredScores.sort((a: QuizScore, b: QuizScore) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
    });
  } catch (error) {
    console.error("Error getting leaderboard data:", error);
    return [];
  }
};

// Calculate user rank in leaderboard
export const getUserRank = (username: string, course: string = "all"): number => {
  try {
    const leaderboard = getLeaderboardData(course);
    const userIndex = leaderboard.findIndex((entry: QuizScore) => entry.username === username);
    return userIndex !== -1 ? userIndex + 1 : 0;
  } catch (error) {
    console.error("Error getting user rank:", error);
    return 0;
  }
};