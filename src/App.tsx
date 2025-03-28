
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Global in-memory storage when localStorage is not available
const inMemoryStorage = new Map<string, string>();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState<boolean>(false);
  
  // Safe storage access
  const safeStorage = {
    getItem: (key: string): string | null => {
      if (isLocalStorageAvailable) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.warn(`Error reading ${key} from localStorage, using in-memory fallback`);
        }
      }
      return inMemoryStorage.get(key) || null;
    },
    
    setItem: (key: string, value: string): void => {
      if (isLocalStorageAvailable) {
        try {
          localStorage.setItem(key, value);
          return;
        } catch (e) {
          console.warn(`Error writing ${key} to localStorage, using in-memory fallback`);
        }
      }
      inMemoryStorage.set(key, value);
    },
    
    removeItem: (key: string): void => {
      if (isLocalStorageAvailable) {
        try {
          localStorage.removeItem(key);
          return;
        } catch (e) {
          console.warn(`Error removing ${key} from localStorage, using in-memory fallback`);
        }
      }
      inMemoryStorage.delete(key);
    }
  };

  // Check if localStorage is available without actually using it
  useEffect(() => {
    try {
      // Don't attempt to use localStorage here, just check if it exists
      const available = typeof window !== 'undefined' && 
                        typeof window.localStorage !== 'undefined';
      
      // Additional checks without actually using the API
      if (available) {
        // Test if we're in a sandboxed environment by checking constructor
        const testKey = '__storage_test__';
        // Just to be extra safe, try with a minimal operation
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        setIsLocalStorageAvailable(true);
      }
    } catch (e) {
      console.warn('localStorage is not available:', e);
      setIsLocalStorageAvailable(false);
    }
  }, []);

  // Initialize auth state safely
  useEffect(() => {
    const user = safeStorage.getItem('journal-user');
    setIsAuthenticated(!!user);
    setIsLoading(false);
  }, [isLocalStorageAvailable]);

  // Authentication methods for the context
  const login = (userData: any) => {
    safeStorage.setItem('journal-user', JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    safeStorage.removeItem('journal-user');
    setIsAuthenticated(false);
  };

  // Export safeStorage for use elsewhere
  (window as any).safeStorage = safeStorage;

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
          <MemoryRouter initialEntries={['/']}> 
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/journal" /> : <Index />} />
              <Route path="/journal" element={isAuthenticated ? <Journal /> : <Navigate to="/" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
