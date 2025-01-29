import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../services/AuthService";

interface AuthContextType {
  isAuthenticated: boolean;
  registerUser: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // **Register User**
  const registerUser = async (email: string, password: string) => {
    const { token } = await apiRegister(email, password);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // **Login User**
  const loginUser = async (email: string, password: string) => {
    const { token } = await apiLogin(email, password);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // **Logout User**
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, registerUser, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};