const API_BASE = 'http://localhost:3000/api'; // Changed to main API server

export const chatService = {
  // Get list of all users and admins for chat
  getAllFriend: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get users');
      }

      return data;
    } catch (error) {
      console.error('Get chat users error:', error);
      throw error;
    }
  },

};