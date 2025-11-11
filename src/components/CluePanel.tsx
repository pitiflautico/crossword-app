import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Clue } from '../types';
import { useStore } from '../store';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

interface CluePanelProps {
  theme: 'light' | 'dark';
}

export const CluePanel: React.FC<CluePanelProps> = ({ theme }) => {
  const { currentCrossword, gameState, selectClue } = useStore();
  const [activeTab, setActiveTab] = useState<'across' | 'down'>('across');

  const colors = COLORS[theme];

  if (!currentCrossword || !gameState) {
    return null;
  }

  const clues = activeTab === 'across' ? currentCrossword.clues.across : currentCrossword.clues.down;

  const handleCluePress = (clue: Clue) => {
    selectClue(clue);
  };

  const isClueSelected = (clue: Clue): boolean => {
    return (
      gameState.selectedClue?.number === clue.number &&
      gameState.selectedClue?.direction === clue.direction
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'across' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setActiveTab('across')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'across' ? '#FFFFFF' : colors.text,
              },
            ]}
          >
            Across
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'down' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setActiveTab('down')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'down' ? '#FFFFFF' : colors.text,
              },
            ]}
          >
            Down
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clues List */}
      <ScrollView
        style={styles.cluesList}
        contentContainerStyle={styles.cluesContent}
        showsVerticalScrollIndicator={false}
      >
        {clues.map((clue) => (
          <TouchableOpacity
            key={`${clue.direction}-${clue.number}`}
            style={[
              styles.clueItem,
              {
                backgroundColor: isClueSelected(clue)
                  ? colors.primary + '20'
                  : 'transparent',
                borderLeftColor: isClueSelected(clue) ? colors.primary : 'transparent',
              },
            ]}
            onPress={() => handleCluePress(clue)}
            activeOpacity={0.7}
          >
            <Text style={[styles.clueNumber, { color: colors.primary }]}>
              {clue.number}.
            </Text>
            <Text style={[styles.clueText, { color: colors.text }]}>
              {clue.clue}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
  cluesList: {
    flex: 1,
  },
  cluesContent: {
    padding: SPACING.md,
  },
  clueItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
  },
  clueNumber: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginRight: SPACING.sm,
    minWidth: 30,
  },
  clueText: {
    fontSize: FONTS.sizes.md,
    flex: 1,
    lineHeight: 20,
  },
});
