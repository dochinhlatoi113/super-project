'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref để lưu timeout cho auto refresh
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function để setup auto refresh token
  const setupAutoRefresh = () => {
    // Clear timeout cũ nếu có
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Parse JWT để lấy expiry time
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = (payload.exp - currentTime) * 1000; // Convert to milliseconds

      // Refresh token 5 phút trước khi hết hạn
      const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 1000); // At least 1 second

      console.log(`🔄 Auto refresh scheduled in ${Math.round(refreshTime / 1000 / 60)} minutes`);

      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('🔄 Auto refreshing token...');
          const newTokens = await authService.refreshToken();
          
          // Update localStorage
          localStorage.setItem('token', newTokens.accessToken);
          localStorage.setItem('refreshToken', newTokens.refreshToken);
          
          console.log('✅ Token auto-refreshed successfully');
          
          // Setup lại auto refresh cho token mới
          setupAutoRefresh();
        } catch (error) {
          console.error('❌ Auto refresh failed:', error);
          // Logout nếu refresh thất bại
          logout();
        }
      }, refreshTime);
    } catch (error) {
      console.error('❌ Error parsing token for auto refresh:', error);
    }
  };

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      
      // Setup auto refresh token
      setupAutoRefresh();
    }
    setIsLoading(false);

    // Cleanup function
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(email, password);

      // Check all required fields exist
      if (response.success && response.admin && response.tokens) {
        const user: User = {
          id: response.admin._id,
          email: response.admin.email,
          name: response.admin.fullName,
          role: response.admin.role.name,
        };

        setUser(user);
        setIsAuthenticated(true);

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        
        // Setup auto refresh token
        setupAutoRefresh();
      } else {
        throw new Error(response.message || 'Login failed - missing required data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    // Clear auto refresh timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
