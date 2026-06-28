import { TextStyle } from 'react-native';

export const lightColors = {
  primary: '#FACC15', // Bold Yellow
  secondary: '#38BDF8', // Accent Blue
  background: '#F1F5F9', // Light background
  surface: '#FFFFFF', // White surface
  text: '#0F172A', // Dark text
  textSecondary: '#64748B', // Muted text
  border: '#E2E8F0', // Subtle border
  error: '#EF4444',
  success: '#10B981',
  white: '#FFFFFF',
};

export const darkColors = {
  primary: '#FACC15', // Bold Yellow
  secondary: '#38BDF8', // Accent Blue
  background: '#0B1120', // Deep Dark Blue
  surface: '#1E293B', // Dark card background
  text: '#F8FAFC', // Light text
  textSecondary: '#94A3B8', // Muted grey-blue text
  border: '#334155', // Dark border
  error: '#EF4444',
  success: '#10B981',
  white: '#FFFFFF',
};

export const lightMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#b3b3b3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d8e8" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5f5e0" }] }
];

export const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a2035" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B1120" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#243050" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a2035" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c3e6b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0B1120" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
];

// Default is darkColors to preserve existing dark styling
export const colors = darkColors;

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
