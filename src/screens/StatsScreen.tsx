import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useStore } from '../store';
import { DifficultyLevel } from '../types';
import { StatCard } from '../components/StatCard';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS, DIFFICULTY_INFO } from '../constants/theme';

export const StatsScreen: React.FC = () => {
  const { statistics, settings, clearStatistics } = useStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const colors = COLORS[settings.theme];
  const shadows = SHADOWS[settings.theme];

  const formatTime = (milliseconds: number): string => {
    if (milliseconds === 0) return '--';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Statistics',
      'Are you sure you want to clear all statistics? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearStatistics();
            Alert.alert('Success', 'All statistics have been cleared.');
          },
        },
      ]
    );
  };

  const getStatsForDifficulty = () => {
    if (selectedDifficulty === 'all') {
      return {
        played: statistics.gamesPlayed,
        completed: statistics.gamesCompleted,
        totalTime: statistics.totalTime,
        averageTime: statistics.averageTime,
        bestTime: statistics.bestTime,
        hintsUsed: statistics.totalHintsUsed,
        completionPercentage: statistics.completionPercentage,
      };
    } else {
      const diffStats = statistics.byDifficulty[selectedDifficulty];
      return {
        played: diffStats.played,
        completed: diffStats.completed,
        totalTime: diffStats.totalTime,
        averageTime: diffStats.played > 0 ? diffStats.totalTime / diffStats.played : 0,
        bestTime: diffStats.bestTime,
        hintsUsed: diffStats.hintsUsed,
        completionPercentage:
          diffStats.played > 0 ? (diffStats.completed / diffStats.played) * 100 : 0,
      };
    }
  };

  const stats = getStatsForDifficulty();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>📊 Statistics</Text>

        {/* Difficulty Filter */}
        <View style={[styles.filterContainer, { backgroundColor: colors.surface }, shadows.medium]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedDifficulty === 'all' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSelectedDifficulty('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: selectedDifficulty === 'all' ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {Object.entries(DIFFICULTY_INFO).map(([key, info]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterButton,
                  selectedDifficulty === key && { backgroundColor: info.color },
                ]}
                onPress={() => setSelectedDifficulty(key as DifficultyLevel)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    {
                      color: selectedDifficulty === key ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {info.icon} {info.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Games Played"
            value={stats.played}
            theme={settings.theme}
            icon="🎮"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            theme={settings.theme}
            icon="✅"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Completion Rate"
            value={`${stats.completionPercentage.toFixed(0)}%`}
            theme={settings.theme}
            icon="📈"
          />
          <StatCard
            label="Hints Used"
            value={stats.hintsUsed}
            theme={settings.theme}
            icon="💡"
          />
        </View>

        {/* Time Stats */}
        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.medium]}>
          <Text style={[styles.sectionHeader, { color: colors.primary }]}>⏱️ Time Stats</Text>

          <View style={styles.timeStatRow}>
            <Text style={[styles.timeStatLabel, { color: colors.textSecondary }]}>
              Best Time:
            </Text>
            <Text style={[styles.timeStatValue, { color: colors.text }]}>
              {formatTime(stats.bestTime)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.timeStatRow}>
            <Text style={[styles.timeStatLabel, { color: colors.textSecondary }]}>
              Average Time:
            </Text>
            <Text style={[styles.timeStatValue, { color: colors.text }]}>
              {formatTime(stats.averageTime)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.timeStatRow}>
            <Text style={[styles.timeStatLabel, { color: colors.textSecondary }]}>
              Total Time Played:
            </Text>
            <Text style={[styles.timeStatValue, { color: colors.text }]}>
              {formatTime(stats.totalTime)}
            </Text>
          </View>
        </View>

        {/* By Difficulty Breakdown */}
        {selectedDifficulty === 'all' && (
          <View style={[styles.section, { backgroundColor: colors.surface }, shadows.medium]}>
            <Text style={[styles.sectionHeader, { color: colors.primary }]}>
              📋 By Difficulty
            </Text>

            {Object.entries(DIFFICULTY_INFO).map(([key, info]) => {
              const diffStats = statistics.byDifficulty[key as DifficultyLevel];
              return (
                <View key={key} style={styles.difficultyRow}>
                  <View style={styles.difficultyHeader}>
                    <Text style={styles.difficultyIcon}>{info.icon}</Text>
                    <Text style={[styles.difficultyName, { color: colors.text }]}>
                      {info.label}
                    </Text>
                  </View>
                  <View style={styles.difficultyStats}>
                    <Text style={[styles.difficultyStatText, { color: colors.textSecondary }]}>
                      {diffStats.completed}/{diffStats.played} completed
                    </Text>
                    <Text style={[styles.difficultyStatText, { color: colors.textSecondary }]}>
                      Best: {formatTime(diffStats.bestTime)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Clear Data Button */}
        <TouchableOpacity
          style={[
            styles.clearButton,
            { backgroundColor: colors.error + '20', borderColor: colors.error },
          ]}
          onPress={handleClearData}
          activeOpacity={0.7}
        >
          <Text style={[styles.clearButtonText, { color: colors.error }]}>
            🗑️ Clear All Statistics
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  filterContainer: {
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  filterButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.xs,
  },
  filterButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
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
  timeStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  timeStatLabel: {
    fontSize: FONTS.sizes.md,
  },
  timeStatValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.xs,
  },
  difficultyRow: {
    marginBottom: SPACING.md,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  difficultyIcon: {
    fontSize: FONTS.sizes.xl,
    marginRight: SPACING.sm,
  },
  difficultyName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  difficultyStats: {
    marginLeft: SPACING.xl,
  },
  difficultyStatText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  clearButton: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  clearButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});
