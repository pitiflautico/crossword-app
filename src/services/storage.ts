import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Settings, Statistics } from '../types';

const KEYS = {
  SETTINGS: '@crossword_settings',
  STATISTICS: '@crossword_statistics',
  GAME_STATE: '@crossword_game_state',
};

// Settings
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<Settings | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

// Statistics
export const saveStatistics = async (statistics: Statistics): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.STATISTICS, JSON.stringify(statistics));
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
};

export const loadStatistics = async (): Promise<Statistics | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.STATISTICS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading statistics:', error);
    return null;
  }
};

// Game State
export const saveGameState = async (gameState: GameState): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.GAME_STATE, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

export const clearGameState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.GAME_STATE);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([KEYS.SETTINGS, KEYS.STATISTICS, KEYS.GAME_STATE]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
