"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, authStorage, type LoginRequest, type RegisterRequest } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user on mount
    const token = authStorage.getToken();
    const storedUser = authStorage.getUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await apiLogin(credentials);
    if (response.success && response.user) {
      setUser(response.user);
    }
  };

  const register = async (credentials: RegisterRequest) => {
    const response = await apiRegister(credentials);
    if (response.success && response.user) {
      setUser(response.user);
    }
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
