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
  // Standard: 'light' (Sport-Design)
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('theme') as ThemeType;
    return saved && themes[saved] ? saved : 'light';
  });

  const theme = themes[themeType];

  useEffect(() => {
    localStorage.setItem('theme', themeType);
  }, [themeType]);

  const setTheme = (newTheme: ThemeType) => setThemeType(newTheme);

  const toggleTheme = () => {
    const order: ThemeType[] = ['light', 'dark', 'fun', 'ocean'];
    const next = (order.indexOf(themeType) + 1) % order.length;
    setThemeType(order[next]);
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

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
