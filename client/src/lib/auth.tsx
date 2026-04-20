import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import type { User, UserRole } from "../../../shared/schema";

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "fisher" | "buyer";
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "marinecatch_auth";

function getStoredAuth(): { user: User | null; session: AuthSession | null } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { user: null, session: null };
}

function storeAuth(user: User | null, session: AuthSession | null) {
  if (user && session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, session }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { user: storedUser, session: storedSession } = getStoredAuth();
    
    if (storedUser && storedSession) {
      if (storedSession.expiresAt * 1000 > Date.now()) {
        setUser(storedUser);
        setSession(storedSession);
      } else {
        refreshSessionFromToken(storedSession.refreshToken);
      }
    }
    
    setIsLoading(false);
  }, []);

  async function refreshSessionFromToken(refreshToken: string) {
    try {
      const response = await apiRequest("/api/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      
      const data = await response.json();
      
      if (data.session) {
        const meResponse = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${data.session.accessToken}`,
          },
        });
        
        if (meResponse.ok) {
          const meData = await meResponse.json();
          setUser(meData.user);
          setSession(data.session);
          storeAuth(meData.user, data.session);
        }
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      storeAuth(null, null);
    }
  }

  async function login(email: string, password: string) {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    setUser(data.user);
    setSession(data.session);
    storeAuth(data.user, data.session);
  }

  async function register(registerData: RegisterData) {
    const response = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    if (data.session) {
      setUser(data.user);
      setSession(data.session);
      storeAuth(data.user, data.session);
    }
  }

  async function logout() {
    try {
      if (session) {
        await apiRequest("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setSession(null);
      storeAuth(null, null);
    }
  }

  async function refreshSession() {
    if (session?.refreshToken) {
      await refreshSessionFromToken(session.refreshToken);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const auth = useAuth();
  
  const hasAccess = auth.isAuthenticated && 
    (!allowedRoles || allowedRoles.includes(auth.user!.role));
  
  return {
    ...auth,
    hasAccess,
  };
}
