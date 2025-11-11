import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../store';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface TimerDisplayProps {
  theme: 'light' | 'dark';
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ theme }) => {
  const { gameState, settings } = useStore();
  const [displayTime, setDisplayTime] = useState(0);
  const colors = COLORS[theme];

  useEffect(() => {
    if (!gameState || !settings.timerEnabled) return;

    if (gameState.isPaused || gameState.isCompleted) {
      setDisplayTime(gameState.elapsedTime);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = gameState.elapsedTime + (Date.now() - gameState.startTime);
      setDisplayTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, settings.timerEnabled]);

  if (!settings.timerEnabled || !gameState) {
    return null;
  }

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Time</Text>
      <Text style={[styles.time, { color: colors.text }]}>
        {formatTime(displayTime)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  time: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
