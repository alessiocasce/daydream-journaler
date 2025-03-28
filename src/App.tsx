
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
import { createContext, useEffect, useState } from "react";

// Create an authentication context to be used across the app
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
  isLocalStorageAvailable: boolean;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLocalStorageAvailable: true,
});

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState<boolean>(true);
  const [inMemoryUser, setInMemoryUser] = useState<any>(null);
  const [inMemoryUsers, setInMemoryUsers] = useState<any[]>([]);

  // Check if localStorage is available without actually using it
  // This avoids the SecurityError
  const checkLocalStorage = () => {
    try {
      return typeof window !== 'undefined' && 
             typeof window.localStorage !== 'undefined' && 
             typeof window.localStorage.setItem === 'function';
    } catch (e) {
      console.warn('localStorage is not available, using in-memory storage instead');
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const isAvailable = checkLocalStorage();
    setIsLocalStorageAvailable(isAvailable);
    
    if (isAvailable) {
      try {
        const user = localStorage.getItem('journal-user');
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        setIsAuthenticated(!!inMemoryUser);
        setIsLocalStorageAvailable(false);
      }
    } else {
      setIsAuthenticated(!!inMemoryUser);
    }
    
    setIsLoading(false);
  }, [inMemoryUser]);

  // Authentication methods for the context
  const login = (userData: any) => {
    if (isLocalStorageAvailable) {
      try {
        localStorage.setItem('journal-user', JSON.stringify(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        setIsLocalStorageAvailable(false);
        setInMemoryUser(userData);
        setIsAuthenticated(true);
      }
    } else {
      setInMemoryUser(userData);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    if (isLocalStorageAvailable) {
      try {
        localStorage.removeItem('journal-user');
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
    setInMemoryUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // Show nothing while initializing
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      isLocalStorageAvailable 
    }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/journal" /> : <Index />} />
              <Route path="/journal" element={isAuthenticated ? <Journal /> : <Navigate to="/" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
