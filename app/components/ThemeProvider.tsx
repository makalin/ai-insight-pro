'use client';

import { useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply theme immediately on mount
    applyTheme();
    setMounted(true);
    
    // Listen for storage changes (when settings are updated)
    const handleStorageChange = () => {
      applyTheme();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event from settings panel
    window.addEventListener('theme-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-changed', handleStorageChange);
    };
  }, []);

  const applyTheme = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const stored = localStorage.getItem('ai-insight-pro-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        const theme = settings.theme || 'light';
        
        const html = document.documentElement;
        
        if (theme === 'dark') {
          html.classList.add('dark');
        } else if (theme === 'light') {
          html.classList.remove('dark');
        } else if (theme === 'auto') {
          // Use system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            html.classList.add('dark');
          } else {
            html.classList.remove('dark');
          }
        }
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  };

  return <>{children}</>;
}

