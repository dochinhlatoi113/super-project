interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  admin?: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    role: {
      _id: string;
      name: string;
      description: string;
      permissions: string[];
      hierarchy: number;
      isActive: boolean;
    };
    department: {
      _id: string;
      name: string;
    };
    permissions: Array<{
      _id: string;
      name: string;
      description: string;
    }>;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(
          'Server returned non-JSON response. Make sure API is running on correct port.'
        );
      }

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the API is running.');
      }
      console.error('Login error:', error);
      throw error;
    }
  },

  refreshToken: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      return data.tokens;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Consider expired if we can't parse
    }
  },

  getValidToken: async (): Promise<string | null> => {
    let token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (authService.isTokenExpired(token)) {
      console.log('🔄 Access token expired, refreshing...');
      try {
        const newTokens = await authService.refreshToken();
        
        // Update localStorage with new tokens
        localStorage.setItem('token', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        
        token = newTokens.accessToken;
        console.log('✅ Token refreshed successfully');
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        // Clear tokens if refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return null;
      }
    }

    return token;
  },
};
