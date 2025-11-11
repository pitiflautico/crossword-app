import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Cell } from '../types';
import { useStore } from '../store';
import { COLORS, SPACING } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = SPACING.md * 2;

interface CrosswordGridProps {
  theme: 'light' | 'dark';
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({ theme }) => {
  const { gameState, currentCrossword, selectCell, settings } = useStore();

  const colors = COLORS[theme];

  const cellSize = useMemo(() => {
    if (!currentCrossword) return 30;
    const availableWidth = SCREEN_WIDTH - GRID_PADDING;
    return Math.floor(availableWidth / currentCrossword.size);
  }, [currentCrossword]);

  if (!gameState || !currentCrossword) {
    return null;
  }

  const handleCellPress = (row: number, col: number) => {
    if (!gameState.grid[row][col].isBlack && !gameState.isPaused) {
      selectCell(row, col);
    }
  };

  const isCellInSelectedWord = (row: number, col: number): boolean => {
    if (!gameState.selectedClue) return false;

    const clue = gameState.selectedClue;
    if (clue.direction === 'across') {
      return (
        row === clue.startRow &&
        col >= clue.startCol &&
        col < clue.startCol + clue.length
      );
    } else {
      return (
        col === clue.startCol &&
        row >= clue.startRow &&
        row < clue.startRow + clue.length
      );
    }
  };

  const isCellSelected = (row: number, col: number): boolean => {
    return (
      gameState.selectedCell?.row === row && gameState.selectedCell?.col === col
    );
  };

  const getCellBackgroundColor = (cell: Cell, row: number, col: number): string => {
    if (cell.isBlack) return colors.blackCell;

    if (isCellSelected(row, col)) return colors.cellHighlight;

    if (isCellInSelectedWord(row, col)) return colors.primary + '30';

    if (settings.showErrors && cell.letter && cell.letter !== cell.correctLetter) {
      return colors.cellError + '30';
    }

    return colors.cellBackground;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.grid,
          {
            width: cellSize * currentCrossword.size,
            height: cellSize * currentCrossword.size,
          },
        ]}
      >
        {gameState.grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getCellBackgroundColor(cell, rowIndex, colIndex),
                    borderColor: colors.gridBorder,
                  },
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
                disabled={cell.isBlack || gameState.isPaused}
                activeOpacity={0.7}
              >
                {cell.number !== undefined && (
                  <Text
                    style={[
                      styles.cellNumber,
                      {
                        color: colors.text,
                        fontSize: cellSize * 0.25,
                      },
                    ]}
                  >
                    {cell.number}
                  </Text>
                )}
                {!cell.isBlack && (
                  <Text
                    style={[
                      styles.cellLetter,
                      {
                        color: colors.text,
                        fontSize: cellSize * 0.6,
                      },
                    ]}
                  >
                    {cell.letter}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    borderWidth: 2,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cellNumber: {
    position: 'absolute',
    top: 1,
    left: 2,
    fontWeight: 'bold',
  },
  cellLetter: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
