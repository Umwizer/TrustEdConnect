// contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryLight: string;
    header: string;
    headerText: string;
    input: string;
  };
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#666666',
    border: '#F0F0F0',
    primary: '#1A237E',
    primaryLight: '#E8EAF6',
    header: '#FFFFFF',
    headerText: '#1A237E',
    input: '#F5F7FA',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    primary: '#60A5FA',
    primaryLight: '#1E3A5F',
    header: '#0B1220',
    headerText: '#F1F5F9',
    input: '#0F172A',
  },
};

interface ThemeContextType {
  theme: Theme;
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('darkMode');
        if (saved === 'true') setDarkMode(true);
      } catch {}
    })();
  }, []);

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    try {
      await AsyncStorage.setItem('darkMode', value ? 'true' : 'false');
    } catch {}
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};