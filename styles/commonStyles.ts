
import { StyleSheet, ViewStyle, TextStyle, Dimensions, Platform } from 'react-native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Determine if device is a tablet
export const isTablet = () => {
  const aspectRatio = height / width;
  return (
    (Platform.OS === 'ios' && (width >= 768 || height >= 768)) ||
    (Platform.OS === 'android' && (width >= 600 || height >= 600)) ||
    (Platform.OS === 'web' && width >= 768)
  );
};

// Responsive padding based on device size
export const getResponsivePadding = () => {
  return isTablet() ? 24 : 16;
};

// Responsive font sizes
export const getResponsiveFontSize = (baseSize: number) => {
  return isTablet() ? baseSize * 1.2 : baseSize;
};

// Light Mode Colors
export const lightColors = {
  background: '#F5F5F5',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#4CAF50',
  secondary: '#F44336',
  accent: '#2196F3',
  card: '#FFFFFF',
  highlight: '#E0E0E0',
  border: '#DDDDDD',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  danger: '#F44336',
  info: '#2196F3',
};

// Dark Mode Colors
export const darkColors = {
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#66BB6A',
  secondary: '#EF5350',
  accent: '#42A5F5',
  card: '#1E1E1E',
  highlight: '#2C2C2C',
  border: '#333333',
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  danger: '#EF5350',
  info: '#42A5F5',
};

// Default to light colors (will be updated by context)
export let colors = lightColors;

export const setColorScheme = (isDark: boolean) => {
  colors = isDark ? darkColors : lightColors;
};

export const getColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  accent: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  danger: {
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextOutline: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
