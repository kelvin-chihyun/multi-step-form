export const theme = {
  colors: {
    primary: {
      main: '#000000',
      dark: '#1a1a1a',
      light: '#4d4d4d',
    },
    text: {
      primary: '#000000',
      secondary: '#4d4d4d',
      light: '#ffffff',
    },
    background: {
      main: '#ffffff',
      secondary: '#f5f5f5',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
      xxxl: '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    text: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
} as const;

export type Theme = typeof theme;
