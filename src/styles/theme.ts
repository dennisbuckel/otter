export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  error: string;
  success: string;
  card: string;
  border: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    main: string;
    heading: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#1E88E5', // Blue
    secondary: '#00ACC1', // Cyan
    background: '#F5F5F5',
    text: '#212121',
    accent: '#FF9800', // Orange
    error: '#F44336', // Red
    success: '#4CAF50', // Green
    card: '#FFFFFF',
    border: '#E0E0E0',
  },
  fonts: {
    main: "'Roboto', 'Segoe UI', sans-serif",
    heading: "'Poppins', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#2196F3', // Blue
    secondary: '#00BCD4', // Cyan
    background: '#121212',
    text: '#FFFFFF',
    accent: '#FFA726', // Orange
    error: '#EF5350', // Red
    success: '#66BB6A', // Green
    card: '#1E1E1E',
    border: '#333333',
  },
  fonts: {
    main: "'Roboto', 'Segoe UI', sans-serif",
    heading: "'Poppins', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.3)',
    large: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
};

export const funTheme: Theme = {
  colors: {
    primary: '#FF5722', // Deep Orange
    secondary: '#00BCD4', // Cyan
    background: '#2E7D32', // Green
    text: '#FFFFFF',
    accent: '#FFC107', // Amber
    error: '#FF5252', // Red
    success: '#69F0AE', // Green
    card: '#388E3C', // Lighter Green
    border: '#43A047', // Even Lighter Green
  },
  fonts: {
    main: "'Roboto', 'Segoe UI', sans-serif",
    heading: "'Poppins', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.3)',
    large: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
};

export type ThemeType = 'light' | 'dark' | 'fun';

export const themes: Record<ThemeType, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  fun: funTheme,
};

export default themes;
