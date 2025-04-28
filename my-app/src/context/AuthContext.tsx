"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define user data type
interface User {
  email: string;
  // You can add more user fields as needed
}

// Define the Context data type
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// Create Context (initial value is false)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check login status and user information from localStorage when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
