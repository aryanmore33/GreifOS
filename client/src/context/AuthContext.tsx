import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, getMe, loginUser, registerUser, logoutUser } from "@/services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<User>;
  register: (data: {
    name: string;
    email?: string;
    password: string;
    phone: string;
    role: "owner" | "nominee";
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from cookie on mount
  useEffect(() => {
    getMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (phone: string, password: string) => {
    const res = await loginUser({ phone, password });
    setUser(res.user);
    return res.user;
  };

  const register = async (data: {
    name: string;
    email?: string;
    password: string;
    phone: string;
    role: "owner" | "nominee";
  }) => {
    await registerUser(data);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
