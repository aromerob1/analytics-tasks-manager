import { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
} from '../services/AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  registerUser: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  //Register User
  const registerUser = async (email: string, password: string) => {
    try {
      const newToken = await apiRegister(email, password);
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', email.split('@')[0]);
      setToken(newToken);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed. Please try again.');
    }
  };

  //Login User
  const loginUser = async (email: string, password: string) => {
    try {
      const newToken = await apiLogin(email, password);
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', email.split('@')[0]);
      setToken(newToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password.');
    }
  };

  //Logout User
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        registerUser,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
