import { create } from 'zustand';
import { GameState, Settings, Statistics, CrosswordData, Cell, Clue, DifficultyLevel } from '../types';
import { loadSettings, saveSettings, loadStatistics, saveStatistics, loadGameState, saveGameState, clearGameState } from '../services/storage';

interface AppStore {
  // Game State
  gameState: GameState | null;
  currentCrossword: CrosswordData | null;

  // Settings
  settings: Settings;

  // Statistics
  statistics: Statistics;

  // Actions
  startNewGame: (crossword: CrosswordData) => void;
  updateCell: (row: number, col: number, letter: string) => void;
  selectCell: (row: number, col: number) => void;
  selectClue: (clue: Clue) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  useHint: () => void;
  checkCompletion: () => boolean;
  completeGame: () => void;
  resetGame: () => void;

  // Settings Actions
  updateSettings: (newSettings: Partial<Settings>) => void;
  loadSettingsFromStorage: () => Promise<void>;

  // Statistics Actions
  updateStatistics: (gameState: GameState) => void;
  loadStatisticsFromStorage: () => Promise<void>;
  clearStatistics: () => void;

  // Persistence
  loadGameFromStorage: () => Promise<void>;
  saveGameToStorage: () => void;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  timerEnabled: true,
  showErrors: false,
  defaultDifficulty: 'medium',
  theme: 'light',
  hapticsEnabled: true,
  tutorialCompleted: false,
};

const defaultStatistics: Statistics = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  totalHintsUsed: 0,
  totalTime: 0,
  averageTime: 0,
  bestTime: 0,
  completionPercentage: 0,
  byDifficulty: {
    easy: { played: 0, completed: 0, totalTime: 0, bestTime: 0, hintsUsed: 0 },
    medium: { played: 0, completed: 0, totalTime: 0, bestTime: 0, hintsUsed: 0 },
    hard: { played: 0, completed: 0, totalTime: 0, bestTime: 0, hintsUsed: 0 },
    expert: { played: 0, completed: 0, totalTime: 0, bestTime: 0, hintsUsed: 0 },
  },
};

export const useStore = create<AppStore>((set, get) => ({
  gameState: null,
  currentCrossword: null,
  settings: defaultSettings,
  statistics: defaultStatistics,

  startNewGame: (crossword: CrosswordData) => {
    const gameState: GameState = {
      crosswordId: crossword.id,
      grid: JSON.parse(JSON.stringify(crossword.grid)), // Deep clone
      startTime: Date.now(),
      elapsedTime: 0,
      hintsUsed: 0,
      isPaused: false,
      isCompleted: false,
      selectedCell: null,
      selectedClue: null,
      difficulty: crossword.difficulty,
    };

    set({ gameState, currentCrossword: crossword });

    // Update statistics
    const stats = get().statistics;
    const newStats = { ...stats };
    newStats.gamesPlayed++;
    newStats.byDifficulty[crossword.difficulty].played++;
    set({ statistics: newStats });

    saveGameState(gameState);
    saveStatistics(newStats);
  },

  updateCell: (row: number, col: number, letter: string) => {
    const { gameState } = get();
    if (!gameState || gameState.isPaused || gameState.isCompleted) return;

    const newGrid = [...gameState.grid];
    if (newGrid[row] && newGrid[row][col] && !newGrid[row][col].isBlack) {
      newGrid[row][col] = { ...newGrid[row][col], letter: letter.toUpperCase() };
    }

    const newGameState = { ...gameState, grid: newGrid };
    set({ gameState: newGameState });
    saveGameState(newGameState);
  },

  selectCell: (row: number, col: number) => {
    const { gameState, currentCrossword } = get();
    if (!gameState || !currentCrossword) return;

    // Find the clue that contains this cell
    let clue: Clue | null = null;
    const allClues = [...currentCrossword.clues.across, ...currentCrossword.clues.down];

    for (const c of allClues) {
      if (c.direction === 'across') {
        if (c.startRow === row && col >= c.startCol && col < c.startCol + c.length) {
          clue = c;
          break;
        }
      } else {
        if (c.startCol === col && row >= c.startRow && row < c.startRow + c.length) {
          clue = c;
          break;
        }
      }
    }

    set({
      gameState: {
        ...gameState,
        selectedCell: { row, col },
        selectedClue: clue
      }
    });
  },

  selectClue: (clue: Clue) => {
    const { gameState } = get();
    if (!gameState) return;

    set({
      gameState: {
        ...gameState,
        selectedCell: { row: clue.startRow, col: clue.startCol },
        selectedClue: clue
      }
    });
  },

  pauseGame: () => {
    const { gameState } = get();
    if (!gameState || gameState.isCompleted) return;

    const elapsed = gameState.elapsedTime + (Date.now() - gameState.startTime);
    set({
      gameState: {
        ...gameState,
        isPaused: true,
        elapsedTime: elapsed
      }
    });
  },

  resumeGame: () => {
    const { gameState } = get();
    if (!gameState || gameState.isCompleted) return;

    set({
      gameState: {
        ...gameState,
        isPaused: false,
        startTime: Date.now()
      }
    });
  },

  useHint: () => {
    const { gameState, currentCrossword } = get();
    if (!gameState || !currentCrossword || !gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const newGrid = [...gameState.grid];
    const correctLetter = currentCrossword.grid[row][col].correctLetter;

    if (newGrid[row][col].letter !== correctLetter) {
      newGrid[row][col] = {
        ...newGrid[row][col],
        letter: correctLetter,
        isCorrect: true
      };

      const newGameState = {
        ...gameState,
        grid: newGrid,
        hintsUsed: gameState.hintsUsed + 1
      };
      set({ gameState: newGameState });
      saveGameState(newGameState);
    }
  },

  checkCompletion: () => {
    const { gameState, currentCrossword } = get();
    if (!gameState || !currentCrossword) return false;

    for (let row = 0; row < gameState.grid.length; row++) {
      for (let col = 0; col < gameState.grid[row].length; col++) {
        const cell = gameState.grid[row][col];
        if (!cell.isBlack) {
          if (cell.letter !== currentCrossword.grid[row][col].correctLetter) {
            return false;
          }
        }
      }
    }
    return true;
  },

  completeGame: () => {
    const { gameState } = get();
    if (!gameState) return;

    const totalTime = gameState.elapsedTime + (Date.now() - gameState.startTime);
    const newGameState = {
      ...gameState,
      isCompleted: true,
      elapsedTime: totalTime,
      isPaused: true
    };

    set({ gameState: newGameState });
    get().updateStatistics(newGameState);
    clearGameState();
  },

  resetGame: () => {
    set({ gameState: null, currentCrossword: null });
    clearGameState();
  },

  updateSettings: async (newSettings: Partial<Settings>) => {
    const { settings } = get();
    const updated = { ...settings, ...newSettings };
    set({ settings: updated });
    await saveSettings(updated);
  },

  loadSettingsFromStorage: async () => {
    const settings = await loadSettings();
    if (settings) {
      set({ settings });
    }
  },

  updateStatistics: (gameState: GameState) => {
    const { statistics } = get();
    const newStats = { ...statistics };

    newStats.gamesCompleted++;
    newStats.totalHintsUsed += gameState.hintsUsed;
    newStats.totalTime += gameState.elapsedTime;
    newStats.averageTime = newStats.totalTime / newStats.gamesCompleted;

    if (newStats.bestTime === 0 || gameState.elapsedTime < newStats.bestTime) {
      newStats.bestTime = gameState.elapsedTime;
    }

    newStats.completionPercentage = (newStats.gamesCompleted / newStats.gamesPlayed) * 100;

    // Update by difficulty
    const diff = gameState.difficulty;
    newStats.byDifficulty[diff].completed++;
    newStats.byDifficulty[diff].totalTime += gameState.elapsedTime;
    newStats.byDifficulty[diff].hintsUsed += gameState.hintsUsed;

    if (
      newStats.byDifficulty[diff].bestTime === 0 ||
      gameState.elapsedTime < newStats.byDifficulty[diff].bestTime
    ) {
      newStats.byDifficulty[diff].bestTime = gameState.elapsedTime;
    }

    set({ statistics: newStats });
    saveStatistics(newStats);
  },

  loadStatisticsFromStorage: async () => {
    const statistics = await loadStatistics();
    if (statistics) {
      set({ statistics });
    }
  },

  clearStatistics: () => {
    set({ statistics: defaultStatistics });
    saveStatistics(defaultStatistics);
  },

  loadGameFromStorage: async () => {
    const gameState = await loadGameState();
    if (gameState) {
      set({ gameState });
    }
  },

  saveGameToStorage: () => {
    const { gameState } = get();
    if (gameState) {
      saveGameState(gameState);
    }
  },
}));
