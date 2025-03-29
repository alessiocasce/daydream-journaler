
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Safe storage implementation that falls back to in-memory storage when localStorage is not available
const createSafeStorage = () => {
  const memoryStorage = new Map();
  
  const isLocalStorageAvailable = () => {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  return {
    getItem: (key) => {
      try {
        if (isLocalStorageAvailable()) {
          return localStorage.getItem(key);
        }
        return memoryStorage.get(key) || null;
      } catch (error) {
        console.error("Error getting item:", error);
        return memoryStorage.get(key) || null;
      }
    },
    setItem: (key, value) => {
      try {
        if (isLocalStorageAvailable()) {
          localStorage.setItem(key, value);
        }
        memoryStorage.set(key, value);
      } catch (error) {
        console.error("Error setting item:", error);
        memoryStorage.set(key, value);
      }
    },
    removeItem: (key) => {
      try {
        if (isLocalStorageAvailable()) {
          localStorage.removeItem(key);
        }
        memoryStorage.delete(key);
      } catch (error) {
        console.error("Error removing item:", error);
        memoryStorage.delete(key);
      }
    }
  };
};

// Create our safe storage instance
export const safeStorage = createSafeStorage();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const user = safeStorage.getItem('journal-user');
      setIsAuthenticated(!!user);
    };
    
    // Initial check
    checkAuth();
    
    // We'll use a custom event for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('journal-storage-change', handleStorageChange);
    
    return () => {
      window.removeEventListener('journal-storage-change', handleStorageChange);
    };
  }, []);

  if (isAuthenticated === null) {
    return null; // Show nothing while checking auth status
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MemoryRouter initialEntries={[isAuthenticated ? "/journal" : "/"]}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/journal" /> : <Index />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
