import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDatabase } from '../db/DatabaseContext';

// Define the user type
export interface User {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
}

// Define the shape of our auth context
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { executeQuery, isLoading: dbLoading } = useDatabase();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        // Check if we have a user in localStorage
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        // Clear any invalid session data
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    // Only check session if database is ready
    if (!dbLoading) {
      checkSession();
    }
  }, [dbLoading]);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Query the database for the user
      const users = executeQuery(
        'SELECT id, username, display_name as displayName, avatar FROM users WHERE username = ? AND password = ?',
        [username, password]
      );
      
      if (users.length === 0) {
        setError('Invalid username or password');
        return false;
      }
      
      const user = users[0] as User;
      
      // Save user to state and localStorage
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading: isLoading || dbLoading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
