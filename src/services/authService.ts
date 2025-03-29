
import { LoginCredentials, RegisterCredentials, AuthResponse } from "@/types/authTypes";
import { toast } from "sonner";

// Set this to your backend API URL
const API_URL = "http://localhost:5000/api";

// Register a new user
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred during registration');
    }
    return null;
  }
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred during login');
    }
    return null;
  }
};

// Logout user
export const logout = (): void => {
  // In a real app with JWT, we just remove the token from localStorage
  localStorage.removeItem("auth_token");
};

// Parse and validate JWT token
export const parseToken = (token: string): { id: string; username: string } | null => {
  try {
    // This is a simple decode, not a verification
    // JWT verification is done on the server
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};
