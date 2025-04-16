
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
    setUser({
      id: 'user-123',
      name: email.split('@')[0],
      email: email,
      avatar: 'https://i.pravatar.cc/150?u=' + email,
    });
    
    setIsAuthenticated(true);
    
    // Show success message
    toast.success("Login successful!", {
      description: "Welcome to Africa HR Leave Management System",
    });
    
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
