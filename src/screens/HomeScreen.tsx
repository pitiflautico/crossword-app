import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store';
import { generateCrossword } from '../services/crosswordGenerator';
import { DifficultyLevel } from '../types';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS, DIFFICULTY_INFO } from '../constants/theme';
import { BannerAdComponent } from '../components/BannerAdComponent';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, startNewGame } = useStore();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const colors = COLORS[settings.theme];
  const shadows = SHADOWS[settings.theme];

  const handleNewGame = (difficulty: DifficultyLevel) => {
    const crossword = generateCrossword(difficulty);
    startNewGame(crossword);
    setShowDifficultyModal(false);
    navigation.navigate('Game' as never);
  };

  const handleHowToPlay = () => {
    navigation.navigate('Tutorial' as never);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoIcon}>🧩</Text>
          </LinearGradient>
          <Text style={[styles.logoText, { color: colors.text }]}>Crossword Master</Text>
          <Text style={[styles.logoSubtext, { color: colors.textSecondary }]}>
            Challenge Your Mind
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }, shadows.medium]}
            onPress={() => setShowDifficultyModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonIcon}>🎮</Text>
            <Text style={styles.primaryButtonText}>New Crossword</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              shadows.small,
            ]}
            onPress={handleHowToPlay}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonIcon, { color: colors.primary }]}>📖</Text>
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              How to Play
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              shadows.small,
            ]}
          >
            <Text style={styles.featureIcon}>💯</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>100% Offline</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Play anywhere, anytime
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              shadows.small,
            ]}
          >
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>4 Difficulty Levels</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              From easy to expert
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              shadows.small,
            ]}
          >
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Track Progress</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Stats and achievements
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Difficulty Selection Modal */}
      <Modal
        visible={showDifficultyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDifficultyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Difficulty</Text>

            {Object.entries(DIFFICULTY_INFO).map(([key, info]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.difficultyButton,
                  { backgroundColor: info.color + '20', borderColor: info.color },
                  shadows.small,
                ]}
                onPress={() => handleNewGame(key as DifficultyLevel)}
                activeOpacity={0.8}
              >
                <Text style={styles.difficultyIcon}>{info.icon}</Text>
                <View style={styles.difficultyInfo}>
                  <Text style={[styles.difficultyLabel, { color: colors.text }]}>
                    {info.label}
                  </Text>
                  <Text style={[styles.difficultyDescription, { color: colors.textSecondary }]}>
                    {info.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={() => setShowDifficultyModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BannerAdComponent position="bottom" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingBottom: 100,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: SPACING.xxl,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoIcon: {
    fontSize: 60,
  },
  logoText: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  logoSubtext: {
    fontSize: FONTS.sizes.lg,
  },
  actionsContainer: {
    marginBottom: SPACING.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  primaryButtonIcon: {
    fontSize: FONTS.sizes.xxl,
    marginRight: SPACING.sm,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
  },
  secondaryButtonIcon: {
    fontSize: FONTS.sizes.xxl,
    marginRight: SPACING.sm,
  },
  secondaryButtonText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  featureCard: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    marginBottom: SPACING.md,
  },
  difficultyIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  difficultyDescription: {
    fontSize: FONTS.sizes.sm,
  },
  cancelButton: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  cancelButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
});
