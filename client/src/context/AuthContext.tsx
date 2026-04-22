"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserPayload = {
  id: string;
  role: string;
  name: string;
  email: string;
};

interface AuthContextType {
  token: string | null;
  user: UserPayload | null;
  login: (token: string, user: UserPayload) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load from local storage on init
    const storedToken = localStorage.getItem("handii_token");
    const storedUser = localStorage.getItem("handii_user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch(e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserPayload) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("handii_token", newToken);
    localStorage.setItem("handii_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("handii_token");
    localStorage.removeItem("handii_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
