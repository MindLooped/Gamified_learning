// API service for backend communication
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api';

class EcoLearnAPI {
  // Authentication
  static async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  static async register(userData: any) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  // Points & Badges
  static async getUserStats(userId: string) {
    const response = await fetch(`${API_BASE}/points/stats/${userId}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });
    return response.json();
  }

  static async awardPoints(userId: string, taskId: string, points: number, verificationData: any) {
    const response = await fetch(`${API_BASE}/points/award`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify({ userId, taskId, points, verificationData })
    });
    return response.json();
  }

  // QR Verification
  static async generateQR(taskId: string, location: any) {
    const response = await fetch(`${API_BASE}/verification/generate-qr`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify({ taskId, location })
    });
    return response.json();
  }

  static async verifyQR(userId: string, qrData: any, location: any) {
    const response = await fetch(`${API_BASE}/verification/verify-qr`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify({ userId, qrData, location })
    });
    return response.json();
  }

  // Leaderboard
  static async getLeaderboard(period: string, category: string, filters?: any) {
    const params = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE}/leaderboard/${period}/${category}?${params}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });
    return response.json();
  }

  static async getUserRanking(userId: string) {
    const response = await fetch(`${API_BASE}/leaderboard/position/${userId}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });
    return response.json();
  }

  // Analytics (for teachers/NGOs)
  static async getAnalytics(scope: string, userId?: string, school?: string) {
    const params = new URLSearchParams({ 
      ...(userId && { userId }), 
      ...(school && { school }) 
    });
    const response = await fetch(`${API_BASE}/leaderboard/analytics/${scope}?${params}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    });
    return response.json();
  }

  // Helper methods
  static getToken() {
    return localStorage.getItem('ecolearn_token') || '';
  }

  static setToken(token: string) {
    localStorage.setItem('ecolearn_token', token);
  }

  static getCurrentUser() {
    const user = localStorage.getItem('ecolearn_user');
    return user ? JSON.parse(user) : null;
  }
}

export default EcoLearnAPI;