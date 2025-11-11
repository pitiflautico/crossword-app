import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store';
import { CrosswordGrid } from '../components/CrosswordGrid';
import { CluePanel } from '../components/CluePanel';
import { CustomKeyboard } from '../components/CustomKeyboard';
import { TimerDisplay } from '../components/TimerDisplay';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';
import { showInterstitialAd, showRewardedAd, isRewardedAdReady } from '../services/adsManager';
import * as Haptics from 'expo-haptics';

export const GameScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    gameState,
    currentCrossword,
    settings,
    pauseGame,
    resumeGame,
    useHint,
    checkCompletion,
    completeGame,
    resetGame,
  } = useStore();

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const colors = COLORS[settings.theme];
  const shadows = SHADOWS[settings.theme];

  useEffect(() => {
    if (!gameState || !currentCrossword) {
      navigation.navigate('Home' as never);
    }
  }, [gameState, currentCrossword]);

  useEffect(() => {
    if (gameState && checkCompletion()) {
      handleGameComplete();
    }
  }, [gameState?.grid]);

  const handlePause = () => {
    pauseGame();
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setShowPauseModal(false);
    resumeGame();
  };

  const handleHint = async () => {
    if (!gameState?.selectedCell) {
      Alert.alert('Select a cell', 'Please select a cell first to get a hint.');
      return;
    }

    if (isRewardedAdReady()) {
      showRewardedAd(() => {
        useHint();
        if (settings.hapticsEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      });
    } else {
      Alert.alert(
        'Ad not ready',
        'Please wait for the rewarded ad to load, or try again later.'
      );
    }
  };

  const handleCheck = () => {
    if (checkCompletion()) {
      handleGameComplete();
    } else {
      Alert.alert('Not complete yet', 'Keep going! Some answers are still incorrect or missing.');
    }
  };

  const handleGameComplete = async () => {
    completeGame();
    setShowCompletionModal(true);

    if (settings.hapticsEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Show interstitial ad after a delay
    setTimeout(() => {
      showInterstitialAd();
    }, 2000);
  };

  const handleExitToHome = () => {
    Alert.alert(
      'Exit Game',
      'Are you sure you want to exit? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            showInterstitialAd();
            navigation.navigate('Home' as never);
          },
        },
      ]
    );
  };

  const handleNewGame = () => {
    setShowCompletionModal(false);
    resetGame();
    navigation.navigate('Home' as never);
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!gameState || !currentCrossword) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.primary }]}
          onPress={handleExitToHome}
        >
          <Text style={styles.headerButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {currentCrossword.title}
          </Text>
          <TimerDisplay theme={settings.theme} />
        </View>

        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.orange }]}
          onPress={handlePause}
        >
          <Text style={styles.headerButtonText}>⏸</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Grid */}
        <View style={styles.gridContainer}>
          <CrosswordGrid theme={settings.theme} />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: colors.surface }, shadows.small]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hints Used</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {gameState.hintsUsed}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }, shadows.medium]}
            onPress={handleHint}
          >
            <Text style={styles.actionButtonIcon}>💡</Text>
            <Text style={styles.actionButtonText}>Hint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }, shadows.medium]}
            onPress={handleCheck}
          >
            <Text style={styles.actionButtonIcon}>✓</Text>
            <Text style={styles.actionButtonText}>Check</Text>
          </TouchableOpacity>
        </View>

        {/* Clues */}
        <View style={styles.cluesContainer}>
          <CluePanel theme={settings.theme} />
        </View>
      </ScrollView>

      {/* Keyboard */}
      <CustomKeyboard theme={settings.theme} />

      {/* Pause Modal */}
      <Modal
        visible={showPauseModal}
        transparent
        animationType="fade"
        onRequestClose={handleResume}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Game Paused</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Take a break!
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleResume}
            >
              <Text style={styles.modalButtonText}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.error }]}
              onPress={handleExitToHome}
            >
              <Text style={styles.modalButtonText}>Exit to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={styles.celebrationIcon}>🎉</Text>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Congratulations!</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              You completed the crossword!
            </Text>

            <View style={styles.completionStats}>
              <Text style={[styles.completionStatText, { color: colors.text }]}>
                Time: {formatTime(gameState.elapsedTime)}
              </Text>
              <Text style={[styles.completionStatText, { color: colors.text }]}>
                Hints Used: {gameState.hintsUsed}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleNewGame}
            >
              <Text style={styles.modalButtonText}>New Game</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border }]}
              onPress={() => {
                setShowCompletionModal(false);
                navigation.navigate('Stats' as never);
              }}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>View Statistics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: FONTS.sizes.xl,
    color: '#FFFFFF',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    paddingVertical: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    minWidth: 100,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  actionButtonIcon: {
    fontSize: FONTS.sizes.xl,
    marginRight: SPACING.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  cluesContainer: {
    height: 300,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  celebrationIcon: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  modalSubtitle: {
    fontSize: FONTS.sizes.lg,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  completionStats: {
    width: '100%',
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  completionStatText: {
    fontSize: FONTS.sizes.lg,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
});
