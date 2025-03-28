
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
import { createContext } from "react";

// Global in-memory storage when localStorage is not available
const inMemoryStorage = new Map<string, string>();

// Create a safe storage context
export const StorageContext = createContext<{
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}>({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  // Safe storage access
  const safeStorage = {
    getItem: (key: string): string | null => {
      try {
        const value = localStorage.getItem(key);
        return value;
      } catch (e) {
        console.warn(`Error reading ${key} from localStorage, using in-memory fallback`);
        return inMemoryStorage.get(key) || null;
      }
    },
    
    setItem: (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn(`Error writing ${key} to localStorage, using in-memory fallback`);
        inMemoryStorage.set(key, value);
      }
    },
    
    removeItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Error removing ${key} from localStorage, using in-memory fallback`);
        inMemoryStorage.delete(key);
      }
    }
  };

  // Export safeStorage for use elsewhere
  (window as any).safeStorage = safeStorage;

  return (
    <StorageContext.Provider value={safeStorage}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <MemoryRouter initialEntries={['/']}> 
            <Routes>
              <Route path="/" element={<Journal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StorageContext.Provider>
  );
};

export default App;
