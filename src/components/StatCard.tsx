import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  theme: 'light' | 'dark';
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, theme, icon }) => {
  const colors = COLORS[theme];
  const shadows = SHADOWS[theme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        shadows.medium,
      ]}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    margin: SPACING.xs,
  },
  icon: {
    fontSize: FONTS.sizes.xxxl,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
});
