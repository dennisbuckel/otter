export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textMuted: string;
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
    pill: string;
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
    card: string;
  };
}

// ─── Sport-Theme (Standard) – Strava / Nike Inspiration ──────────────────────
export const lightTheme: Theme = {
  colors: {
    primary:    '#FC4C02',  // Strava Orange – energetisch, sportlich
    secondary:  '#FF7A3D',  // Helles Orange
    background: '#F4F4F6',  // Sehr helles Grau
    text:       '#111111',  // Fast Schwarz – klar, kräftig
    textMuted:  '#888888',  // Gedämpftes Grau
    accent:     '#1C1C1E',  // Apple Dark – für Kontrast-Elemente
    error:      '#E53E3E',
    success:    '#38A169',
    card:       '#FFFFFF',
    border:     '#E8E8E8',
  },
  fonts: {
    main:    "'Inter', 'Segoe UI', sans-serif",
    heading: "'Inter', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small:  '6px',
    medium: '10px',
    large:  '16px',
    pill:   '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small:  '0 1px 3px rgba(0,0,0,0.08)',
    medium: '0 4px 12px rgba(0,0,0,0.10)',
    large:  '0 8px 24px rgba(0,0,0,0.12)',
    card:   '0 2px 8px rgba(0,0,0,0.07)',
  },
};

// ─── Dark Theme ────────────────────────────────────────────────────────────────
export const darkTheme: Theme = {
  colors: {
    primary:    '#FF6B35',
    secondary:  '#FF9A6C',
    background: '#0D0D0D',
    text:       '#F5F5F5',
    textMuted:  '#888888',
    accent:     '#FF6B35',
    error:      '#FC8181',
    success:    '#68D391',
    card:       '#1A1A1A',
    border:     '#2A2A2A',
  },
  fonts: {
    main:    "'Inter', 'Segoe UI', sans-serif",
    heading: "'Inter', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small:  '6px',
    medium: '10px',
    large:  '16px',
    pill:   '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small:  '0 1px 3px rgba(0,0,0,0.5)',
    medium: '0 4px 12px rgba(0,0,0,0.6)',
    large:  '0 8px 24px rgba(0,0,0,0.7)',
    card:   '0 2px 8px rgba(0,0,0,0.5)',
  },
};

// ─── Amber Theme ───────────────────────────────────────────────────────────────
export const funTheme: Theme = {
  colors: {
    primary:    '#F59E0B',
    secondary:  '#FBBF24',
    background: '#1C1400',
    text:       '#FFFBEB',
    textMuted:  '#D4A017',
    accent:     '#3B82F6',
    error:      '#EF4444',
    success:    '#34D399',
    card:       '#2D2000',
    border:     '#4A3500',
  },
  fonts: {
    main:    "'Inter', 'Segoe UI', sans-serif",
    heading: "'Inter', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small:  '8px',
    medium: '14px',
    large:  '20px',
    pill:   '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small:  '0 1px 3px rgba(0,0,0,0.4)',
    medium: '0 4px 12px rgba(0,0,0,0.5)',
    large:  '0 8px 24px rgba(0,0,0,0.6)',
    card:   '0 2px 8px rgba(0,0,0,0.4)',
  },
};

// ─── Ocean Theme ───────────────────────────────────────────────────────────────
export const oceanTheme: Theme = {
  colors: {
    primary:    '#0EA5E9',
    secondary:  '#38BDF8',
    background: '#082032',
    text:       '#E0F2FE',
    textMuted:  '#7DB9D9',
    accent:     '#FB923C',
    error:      '#EF4444',
    success:    '#10B981',
    card:       '#0C2D4A',
    border:     '#164E6E',
  },
  fonts: {
    main:    "'Inter', 'Segoe UI', sans-serif",
    heading: "'Inter', 'Segoe UI', sans-serif",
  },
  borderRadius: {
    small:  '6px',
    medium: '12px',
    large:  '18px',
    pill:   '999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    small:  '0 1px 3px rgba(0,0,0,0.5)',
    medium: '0 4px 12px rgba(0,0,0,0.6)',
    large:  '0 8px 24px rgba(0,0,0,0.7)',
    card:   '0 2px 8px rgba(0,0,0,0.5)',
  },
};

export type ThemeType = 'light' | 'dark' | 'fun' | 'ocean';

export const themes: Record<ThemeType, Theme> = {
  light: lightTheme,
  dark:  darkTheme,
  fun:   funTheme,
  ocean: oceanTheme,
};

export default themes;
