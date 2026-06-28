import React, { createContext, useContext, useState, useEffect } from 'react';
import { StyleSheet, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  isLightTheme: boolean;
  colors: typeof darkColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'themePref';

// Helper to check IST hour (UTC + 5:30)
const getISTHour = () => {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDate = new Date(utcMs + 330 * 60000);
  return istDate.getHours();
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [isLightTheme, setIsLightTheme] = useState<boolean>(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setThemeModeState(saved as ThemeMode);
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      }
    };
    loadTheme();
  }, []);

  // Update computed light/dark flag when themeMode changes or every 60s (for auto)
  useEffect(() => {
    const calculateTheme = () => {
      if (themeMode === 'light') {
        setIsLightTheme(true);
      } else if (themeMode === 'dark') {
        setIsLightTheme(false);
      } else {
        // Auto mode based on IST time: 6:00 AM - 6:00 PM is light theme, otherwise dark
        const hour = getISTHour();
        const isDay = hour >= 6 && hour < 18;
        setIsLightTheme(isDay);
      }
    };

    calculateTheme();

    // Re-check periodically for 'auto' mode
    const timer = setInterval(calculateTheme, 60000);
    return () => clearInterval(timer);
  }, [themeMode]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const colors = isLightTheme ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ themeMode, isLightTheme, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook helper to generate dynamic styles
export function useThemeStyles<T>(
  factory: (colors: typeof darkColors) => T
): T {
  const { colors } = useTheme();
  return factory(colors);
}
