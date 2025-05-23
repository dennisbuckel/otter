import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes, ThemeType, Theme } from '../styles/theme';
import GlobalStyles from '../styles/globalStyles';

interface ThemeContextType {
  themeType: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Try to get theme from localStorage, default to 'fun' theme
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme && themes[savedTheme] ? savedTheme : 'fun';
  });

  // Get the actual theme object
  const theme = themes[themeType];

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', themeType);
  }, [themeType]);

  // Function to set theme
  const setTheme = (newTheme: ThemeType) => {
    setThemeType(newTheme);
  };

  // Function to toggle between themes
  const toggleTheme = () => {
    const themeOrder: ThemeType[] = ['light', 'dark', 'fun'];
    const currentIndex = themeOrder.indexOf(themeType);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setThemeType(themeOrder[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ themeType, theme, setTheme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
