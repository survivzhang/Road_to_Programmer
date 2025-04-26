"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 定义用户数据类型
interface User {
  email: string;
  // 可以根据需要添加更多用户字段
}

// 定义Context的数据类型
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// 创建Context（初始值是假的）
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 提供器组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 页面加载时从localStorage检查登录状态和用户信息
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

// 自定义hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
