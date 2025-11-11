import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

interface CustomKeyboardProps {
  theme: 'light' | 'dark';
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ theme }) => {
  const { gameState, updateCell, settings } = useStore();
  const colors = COLORS[theme];

  const handleKeyPress = async (key: string) => {
    if (!gameState || !gameState.selectedCell || gameState.isPaused) return;

    if (settings.hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const { row, col } = gameState.selectedCell;

    if (key === '⌫') {
      updateCell(row, col, '');
    } else {
      updateCell(row, col, key);

      // Auto-advance to next cell
      if (gameState.selectedClue) {
        const clue = gameState.selectedClue;
        if (clue.direction === 'across') {
          const nextCol = col + 1;
          if (nextCol < clue.startCol + clue.length) {
            useStore.getState().selectCell(row, nextCol);
          }
        } else {
          const nextRow = row + 1;
          if (nextRow < clue.startRow + clue.length) {
            useStore.getState().selectCell(nextRow, col);
          }
        }
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {rowIndex === 2 && <View style={styles.spacer} />}
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                {
                  backgroundColor: colors.cellBackground,
                  borderColor: colors.border,
                },
                key === '⌫' && styles.specialKey,
              ]}
              onPress={() => handleKeyPress(key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.keyText, { color: colors.text }]}>{key}</Text>
            </TouchableOpacity>
          ))}
          {rowIndex === 2 && <View style={styles.spacer} />}
        </View>
      ))}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.spaceKey,
            {
              backgroundColor: colors.cellBackground,
              borderColor: colors.border,
            },
          ]}
          onPress={() => handleKeyPress(' ')}
          activeOpacity={0.7}
        >
          <Text style={[styles.keyText, { color: colors.text }]}>Space</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  key: {
    minWidth: 32,
    height: 42,
    marginHorizontal: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  specialKey: {
    minWidth: 45,
  },
  spaceKey: {
    flex: 1,
    height: 42,
    marginHorizontal: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
  spacer: {
    width: 20,
  },
});
