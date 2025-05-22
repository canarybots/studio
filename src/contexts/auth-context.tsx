
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback }
from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser as apiLoginUser, setAuthToken, clearAuthToken, getAuthToken } from '@/services/api'; // We'll define these in api.ts
import type { UserCredentials, User } from '@/types'; // Assuming User type might be needed

interface AuthContextType {
  token: string | null;
  user: User | null; // Optional: if you fetch user details
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Optional
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken); // Ensure API service has it
      // Optionally, fetch user details here if token exists
      // e.g., apiFetchCurrentUser().then(setUser).catch(() => logout());
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: UserCredentials) => {
    try {
      const { token: newToken /*, user: loggedInUser (if API returns user) */ } = await apiLoginUser(credentials);
      setToken(newToken);
      setAuthToken(newToken); // Store for API calls and localStorage
      // setUser(loggedInUser); // Optional
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally, use toast to show error
      throw error; // Re-throw for the login page to handle
    }
  }, [router]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuthToken(); // Clear from API service and localStorage
    router.push('/login');
  }, [router]);

  // Effect for route protection
  useEffect(() => {
    if (!isLoading && !token && pathname !== '/login') {
      router.push('/login');
    }
  }, [token, isLoading, pathname, router]);


  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
