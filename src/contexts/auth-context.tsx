
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  team?: string;
  role?: string;
  hasCompletedProfile?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Load user data from localStorage
const loadUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// Save user data to localStorage
const saveUserToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Update localStorage whenever user state changes
  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    // Check if email is from allowed domain
    if (!email.endsWith('@ist.com')) {
      toast.error("Only @ist.com email domains are allowed to access this system.", {
        description: "Please use your company email address to login.",
        duration: 5000,
      });
      return false;
    }

    // In a real implementation, this would verify with your auth provider
    // For demo purposes, we're just setting up a mock user
    const newUser = {
      id: 'user-123',
      name: email.split('@')[0],
      email: email,
      avatar: 'https://i.pravatar.cc/150?u=' + email,
      hasCompletedProfile: false
    };
    
    // Check if we have stored profile data for this user
    const storedUser = loadUserFromStorage();
    if (storedUser && storedUser.email === email) {
      // Merge the stored profile data with the new login data
      setUser({
        ...newUser,
        team: storedUser.team,
        role: storedUser.role,
        hasCompletedProfile: storedUser.team && storedUser.role ? true : false
      });
    } else {
      setUser(newUser);
    }
    
    setIsAuthenticated(true);
    
    // Show success message
    toast.success("Login successful!", {
      description: "Welcome to Africa HR Leave Management System",
    });
    
    return true;
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      
      const updatedUser = { 
        ...prev, 
        ...data,
        hasCompletedProfile: true 
      };
      
      // Save to localStorage
      saveUserToStorage(updatedUser);
      
      return updatedUser;
    });
    
    toast.success("Profile updated successfully!");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
