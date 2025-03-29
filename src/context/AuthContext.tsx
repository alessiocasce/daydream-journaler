
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState, User, LoginCredentials, RegisterCredentials } from "@/types/authTypes";
import { login, logout, register, parseToken } from "@/services/authService";
import { StorageContext } from "@/App";

// Initial auth state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

// Create context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const safeStorage = useContext(StorageContext);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      const token = safeStorage.getItem("auth_token");
      
      if (!token) {
        setState({ ...initialState, loading: false });
        return;
      }

      const userData = parseToken(token);
      
      if (!userData) {
        safeStorage.removeItem("auth_token");
        setState({ ...initialState, loading: false });
        return;
      }

      const user: User = {
        id: userData.id,
        username: userData.username,
      };

      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    };

    loadUser();
  }, [safeStorage]);

  // Login handler
  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    const response = await login(credentials);
    
    if (!response) return false;
    
    const { user, token } = response;
    
    safeStorage.setItem("auth_token", token);
    
    setState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
    
    return true;
  };

  // Register handler
  const handleRegister = async (credentials: RegisterCredentials): Promise<boolean> => {
    const response = await register(credentials);
    
    if (!response) return false;
    
    const { user, token } = response;
    
    safeStorage.setItem("auth_token", token);
    
    setState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
    
    return true;
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    safeStorage.removeItem("auth_token");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
