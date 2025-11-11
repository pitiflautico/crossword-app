export const COLORS = {
  light: {
    primary: '#00A3E0',
    secondary: '#0077B6',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    gridBorder: '#333333',
    cellBackground: '#FFFFFF',
    cellHighlight: '#00A3E0',
    cellCorrect: '#4CAF50',
    cellError: '#F44336',
    blackCell: '#000000',
    orange: '#FF9800',
    purple: '#9C27B0',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
  },
  dark: {
    primary: '#00A3E0',
    secondary: '#0077B6',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
    gridBorder: '#666666',
    cellBackground: '#2C2C2C',
    cellHighlight: '#00A3E0',
    cellCorrect: '#4CAF50',
    cellError: '#F44336',
    blackCell: '#000000',
    orange: '#FF9800',
    purple: '#9C27B0',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
  },
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const DIFFICULTY_INFO = {
  easy: {
    label: 'Easy',
    description: '9x9 grid, ~8 words',
    color: '#4CAF50',
    icon: '😊',
  },
  medium: {
    label: 'Medium',
    description: '11x11 grid, ~12 words',
    color: '#FF9800',
    icon: '🤔',
  },
  hard: {
    label: 'Hard',
    description: '13x13 grid, ~16 words',
    color: '#F44336',
    icon: '😰',
  },
  expert: {
    label: 'Expert',
    description: '15x15 grid, ~20 words',
    color: '#9C27B0',
    icon: '🔥',
  },
};
