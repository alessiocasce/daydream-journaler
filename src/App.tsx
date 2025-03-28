
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
import { createContext, useEffect, useState } from "react";

// Create an authentication context to be used across the app
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, []);

  // Function to check authentication status safely
  const checkAuth = () => {
    try {
      const user = localStorage.getItem('journal-user');
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setIsAuthenticated(false);
    }
  };

  // Authentication methods for the context
  const login = (userData: any) => {
    try {
      localStorage.setItem('journal-user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    try {
      localStorage.removeItem('journal-user');
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // Show nothing while initializing
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/journal" /> : <Index />} />
              <Route path="/journal" element={isAuthenticated ? <Journal /> : <Navigate to="/" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
