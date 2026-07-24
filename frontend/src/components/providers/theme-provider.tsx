'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_KEY = 'theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const resolve = useCallback((t: Theme): 'light' | 'dark' => {
    return t === 'system' ? getSystemTheme() : t;
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      localStorage.setItem(THEME_KEY, next);
      const resolved = resolve(next);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [resolve]
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_KEY) as Theme | null) ?? defaultTheme;
    const resolved = resolve(stored);
    setThemeState(stored);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange() {
      const current = (localStorage.getItem(THEME_KEY) as Theme | null) ?? defaultTheme;
      if (current === 'system') {
        const r = getSystemTheme();
        setResolvedTheme(r);
        applyTheme(r);
      }
    }
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [defaultTheme, resolve]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
