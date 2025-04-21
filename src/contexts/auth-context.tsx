import { deleteToken, getData, setData } from "@/lib/authUtils";
import { User } from "@/types";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { toast } from "sonner";



interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(() => getData());
  console.log("======== USER ========", user);
  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = getData();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Update localStorage whenever user state changes
  useEffect(() => {
    setData(user);
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    // Check if email is from allowed domain
    if (!email.endsWith("@ist.com")) {
      toast.error(
        "Only @ist.com email domains are allowed to access this system.",
        {
          description: "Please use your company email address to login.",
          duration: 5000,
        }
      );
      return false;
    }

    // In a real implementation, this would verify with your auth provider
    // For demo purposes, we're just setting up a mock user

    // Check if we have stored profile data for this user
    const storedUser = getData();
    if (storedUser && storedUser.email === email) {
      setUser({
        ...storedUser,
      });
    }

    setIsAuthenticated(true);

    // Show success message
    toast.success("Login successful! ===><", {
      description: "Welcome to IST Africa Leave Management System",
    });

    return true;
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;

      const updatedUser = {
        ...prev,
        ...data,
        hasCompletedProfile: true,
      };

      setData(updatedUser);

      return updatedUser;
    });

    toast.success("Profile updated successfully!");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    deleteToken();
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
