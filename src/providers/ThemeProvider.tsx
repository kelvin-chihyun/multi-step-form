/** @jsxImportSource @emotion/react */
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ReactNode } from 'react';
import { theme } from '@/styles/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
}
