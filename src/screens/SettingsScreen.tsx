import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useStore } from '../store';
import { DifficultyLevel } from '../types';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../constants/theme';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, clearStatistics, resetGame } = useStore();
  const colors = COLORS[settings.theme];
  const shadows = SHADOWS[settings.theme];

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    updateSettings({ defaultDifficulty: difficulty });
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all game progress and statistics? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            clearStatistics();
            resetGame();
            Alert.alert('Success', 'All progress has been reset.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>⚙️ Settings</Text>

        {/* Game Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.medium]}>
          <Text style={[styles.sectionHeader, { color: colors.primary }]}>Game Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Enable game sounds
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => handleToggle('soundEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Timer</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Show elapsed time
              </Text>
            </View>
            <Switch
              value={settings.timerEnabled}
              onValueChange={(value) => handleToggle('timerEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Show Errors</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Highlight incorrect letters
              </Text>
            </View>
            <Switch
              value={settings.showErrors}
              onValueChange={(value) => handleToggle('showErrors', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Haptic Feedback</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Vibrate on key press
              </Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(value) => handleToggle('hapticsEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Default Difficulty */}
        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.medium]}>
          <Text style={[styles.sectionHeader, { color: colors.primary }]}>Default Difficulty</Text>

          {(['easy', 'medium', 'hard', 'expert'] as DifficultyLevel[]).map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={styles.difficultyOption}
              onPress={() => handleDifficultyChange(difficulty)}
              activeOpacity={0.7}
            >
              <View style={styles.radioButton}>
                {settings.defaultDifficulty === difficulty && (
                  <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={[styles.difficultyLabel, { color: colors.text }]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.medium]}>
          <Text style={[styles.sectionHeader, { color: colors.primary }]}>Appearance</Text>

          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => handleThemeChange('light')}
            activeOpacity={0.7}
          >
            <View style={styles.radioButton}>
              {settings.theme === 'light' && (
                <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text style={[styles.themeLabel, { color: colors.text }]}>☀️ Light Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => handleThemeChange('dark')}
            activeOpacity={0.7}
          >
            <View style={styles.radioButton}>
              {settings.theme === 'dark' && (
                <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text style={[styles.themeLabel, { color: colors.text }]}>🌙 Dark Mode</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.medium]}>
          <Text style={[styles.sectionHeader, { color: colors.error }]}>Danger Zone</Text>

          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: colors.error + '20', borderColor: colors.error }]}
            onPress={handleResetProgress}
            activeOpacity={0.7}
          >
            <Text style={[styles.dangerButtonText, { color: colors.error }]}>
              🗑️ Reset All Progress
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Crossword Master v1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Made with ❤️ for puzzle lovers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  section: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: FONTS.sizes.sm,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00A3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  difficultyLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  themeLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  dangerButton: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  appInfoText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
});
