import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface TutorialStep {
  icon: string;
  title: string;
  description: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    icon: '🎯',
    title: 'Select a Cell',
    description:
      'Tap on any white cell in the crossword grid to select it. The selected cell will be highlighted, and its clue will appear below.',
  },
  {
    icon: '⌨️',
    title: 'Type Your Answer',
    description:
      'Use the on-screen keyboard to enter letters. The cursor will automatically advance to the next cell in the word.',
  },
  {
    icon: '📝',
    title: 'Read the Clues',
    description:
      'Clues are organized into Across and Down. Tap on any clue to jump to that word in the grid. The number matches the grid numbers.',
  },
  {
    icon: '💡',
    title: 'Get Hints',
    description:
      'Stuck on a word? Use the Hint button to reveal one letter. Watch a short ad to unlock hints and help you progress.',
  },
  {
    icon: '⏱️',
    title: 'Track Your Time',
    description:
      'Your elapsed time is shown at the top. Pause the game anytime using the pause button. Your progress is automatically saved.',
  },
  {
    icon: '✓',
    title: 'Check Your Work',
    description:
      'Use the Check button to verify your answers. When you complete the puzzle correctly, you\'ll see your final time and stats!',
  },
];

export const TutorialScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, updateSettings } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  const colors = COLORS[settings.theme];
  const shadows = SHADOWS[settings.theme];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    updateSettings({ tutorialCompleted: true });
    navigation.goBack();
  };

  const handleComplete = () => {
    updateSettings({ tutorialCompleted: true });
    navigation.goBack();
  };

  const step = tutorialSteps[currentStep];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>📖 How to Play</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.skipText, { color: colors.primary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index <= currentStep ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Step Content */}
        <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Text style={styles.stepIcon}>{step.icon}</Text>
          </View>

          <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
          <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
            {step.description}
          </Text>

          {/* Additional Tips Section */}
          {currentStep === tutorialSteps.length - 1 && (
            <View style={[styles.tipsContainer, { backgroundColor: colors.surface }, shadows.medium]}>
              <Text style={[styles.tipsTitle, { color: colors.primary }]}>💡 Pro Tips</Text>

              <View style={styles.tipItem}>
                <Text style={[styles.tipText, { color: colors.text }]}>
                  • Start with shorter words to build momentum
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={[styles.tipText, { color: colors.text }]}>
                  • Intersecting letters help solve other words
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={[styles.tipText, { color: colors.text }]}>
                  • Use hints wisely - they're limited!
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={[styles.tipText, { color: colors.text }]}>
                  • Your progress is saved automatically
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.previousButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={handlePrevious}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>← Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              { backgroundColor: colors.primary },
              currentStep === 0 && styles.fullWidthButton,
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === tutorialSteps.length - 1 ? 'Get Started! 🚀' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
  },
  skipText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: SPACING.xs,
  },
  stepContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  stepIcon: {
    fontSize: 60,
  },
  stepTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FONTS.sizes.lg,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  tipsContainer: {
    width: '100%',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
  },
  tipsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  tipItem: {
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  navButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: {
    borderWidth: 2,
  },
  nextButton: {},
  fullWidthButton: {
    flex: 1,
  },
  navButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
});
