
import { LoginCredentials, RegisterCredentials, AuthResponse } from "@/types/authTypes";
import { toast } from "sonner";

// Mock API endpoint - in production, this would be your actual API
const API_URL = "https://api.example.com";

// Function to simulate API calls with a delay
const simulateApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// In a real app, these users would be stored in a database
const mockUsers = [
  {
    id: "1",
    username: "demo",
    password: "password123",
  },
];

export const login = async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
  try {
    // In a real app, this would be an API call
    const user = mockUsers.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Create a token (in a real app, this would be a JWT from your server)
    const token = btoa(JSON.stringify({ id: user.id, username: user.username }));

    // Simulate API delay
    return await simulateApiCall<AuthResponse>({
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }
    return null;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse | null> => {
  try {
    // Check if passwords match
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Check if username is already taken
    if (mockUsers.some((user) => user.username === credentials.username)) {
      throw new Error("Username already exists");
    }

    // Create a new user (in a real app, this would be saved to a database)
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      username: credentials.username,
      password: credentials.password,
    };

    // Add to mock users
    mockUsers.push(newUser);

    // Create a token (in a real app, this would be a JWT from your server)
    const token = btoa(JSON.stringify({ id: newUser.id, username: newUser.username }));

    // Simulate API delay
    return await simulateApiCall<AuthResponse>({
      user: {
        id: newUser.id,
        username: newUser.username,
      },
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }
    return null;
  }
};

export const logout = (): void => {
  // In a real app, you might need to invalidate the token on the server
  // Here we just remove it from local storage
  localStorage.removeItem("auth_token");
};

// Parse and validate JWT token (simplified version)
export const parseToken = (token: string): { id: string; username: string } | null => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};
