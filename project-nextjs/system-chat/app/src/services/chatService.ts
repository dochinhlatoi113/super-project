const API_BASE = 'http://localhost:3000/api'; // Changed to main API server

export const chatService = {
  // Get list of all users and admins for chat
  getChatUsers: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/conversations/users`, {
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

  // Create conversation with specific participant
  createConversation: async (participantId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE}/conversations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ participantId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create conversation');
      }

      return data;
    } catch (error) {
      console.error('Create conversation error:', error);
      throw error;
    }
  },

  // Get user's conversations
  getMyConversations: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/conversations/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get conversations');
      }

      return data;
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  },

  // Get messages by conversation (keeping for compatibility)
  getMessages: async (conversationId: string, token: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/chat/conversations/${conversationId}/messages`, // Socket.IO server
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }
};