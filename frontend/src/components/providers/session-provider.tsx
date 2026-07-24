'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getSession, logout as apiLogout, type SessionUser } from '@/lib/auth';

interface SessionContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

interface SessionProviderProps {
  children: React.ReactNode;
  initialUser?: SessionUser | null;
}

export function SessionProvider({ children, initialUser = null }: SessionProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await getSession();
      setUser(session?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!initialUser) {
      refresh();
    }
  }, [initialUser, refresh]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      refresh,
      signOut,
    }),
    [user, isLoading, refresh, signOut]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}
