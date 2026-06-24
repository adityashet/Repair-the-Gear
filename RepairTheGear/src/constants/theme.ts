import { TextStyle } from 'react-native';

export const colors = {
  primary: '#000000', // Deep black for primary actions
  secondary: '#276EF1', // Blue accent for links/active states (Uber style)
  background: '#FFFFFF',
  surface: '#F6F6F6', // Light grey for cards
  text: '#121212',
  textSecondary: '#545454',
  border: '#E2E2E2',
  error: '#E11900',
  success: '#048848',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography: Record<string, TextStyle> = {
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
};

export const theme = {
  colors,
  spacing,
  typography,
};
