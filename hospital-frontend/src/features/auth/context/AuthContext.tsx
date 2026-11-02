import { createContext, useContext, useState, type ReactNode } from "react";

import type { AuthResponse } from "../types/auth.types";

interface AuthContextType {
  session: AuthResponse | null;
  setSession: (session: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSessionState] = useState<AuthResponse | null>(() => {
    const storedSession = localStorage.getItem("auth");

    return storedSession ? JSON.parse(storedSession) : null;
  });

  const setSession = (data: AuthResponse) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setSessionState(data);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setSessionState(null);
  };

  return (
    <AuthContext.Provider value={{ session, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
