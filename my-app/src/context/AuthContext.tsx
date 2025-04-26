"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 定义Context的数据类型
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token?: string) => void;
  logout: () => void;
}

// 创建Context（初始值是假的）
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 提供器组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 页面加载时从localStorage检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const login = (token?: string) => {
    // Only set token in localStorage if one is provided
    // This allows the LoginInDialog to set its own token
    if (token) {
      localStorage.setItem("token", token);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
