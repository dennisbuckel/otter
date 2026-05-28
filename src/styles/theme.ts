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
    primary: '#3F51B5', // Indigo - more sophisticated blue
    secondary: '#5C6BC0', // Lighter indigo
    background: '#F8F9FA', // Slightly warmer white
    text: '#2C3E50', // Dark blue-gray - easier on the eyes
    accent: '#FF9800', // Orange - kept for recognition
    error: '#E74C3C', // Softer red
    success: '#2ECC71', // Softer green
    card: '#FFFFFF',
    border: '#E9ECEF', // Slightly darker for better contrast
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
    small: '0 2px 4px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.08)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#6366F1', // Indigo - more vibrant
    secondary: '#818CF8', // Lighter indigo
    background: '#1A202C', // Dark blue-gray - less harsh than pure black
    text: '#F8F9FA', // Off-white - easier on the eyes
    accent: '#F59E0B', // Amber - warmer orange
    error: '#EF4444', // Vibrant red
    success: '#10B981', // Teal green - less harsh
    card: '#2D3748', // Dark blue-gray - softer contrast
    border: '#4A5568', // Medium gray - better definition
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
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
    large: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
};

export const funTheme: Theme = {
  colors: {
    primary: '#F59E0B', // Amber primary
    secondary: '#FBBF24', // Light amber
    background: '#B45309', // Deep amber background
    text: '#FFFFFF', // White text
    accent: '#3B82F6', // Blue accent (complementary to amber)
    error: '#EF4444', // Red
    success: '#34D399', // Emerald green
    card: '#D97706', // Medium amber for cards
    border: '#F59E0B', // Light amber for borders
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

export const oceanTheme: Theme = {
  colors: {
    primary: '#0EA5E9', // Sky blue
    secondary: '#38BDF8', // Lighter sky blue
    background: '#0C4A6E', // Dark blue
    text: '#F0F9FF', // Very light blue
    accent: '#FB923C', // Orange - complementary to blue
    error: '#EF4444', // Red
    success: '#10B981', // Emerald green
    card: '#075985', // Medium blue for cards
    border: '#0284C7', // Bright blue for borders
  },
  fonts: {
    main: "'Roboto', 'Segoe UI', sans-serif",
    heading: "'Poppins', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
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

export type ThemeType = 'light' | 'dark' | 'fun' | 'ocean';

export const themes: Record<ThemeType, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  fun: funTheme,
  ocean: oceanTheme,
};

export default themes;
