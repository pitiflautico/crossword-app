export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface Cell {
  row: number;
  col: number;
  letter: string;
  correctLetter: string;
  number?: number;
  isBlack: boolean;
  isHighlighted: boolean;
  isCorrect?: boolean;
}

export interface Clue {
  number: number;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
  length: number;
}

export interface CrosswordData {
  id: string;
  difficulty: DifficultyLevel;
  grid: Cell[][];
  clues: {
    across: Clue[];
    down: Clue[];
  };
  size: number;
  title: string;
  author: string;
}

export interface GameState {
  crosswordId: string;
  grid: Cell[][];
  startTime: number;
  elapsedTime: number;
  hintsUsed: number;
  isPaused: boolean;
  isCompleted: boolean;
  selectedCell: { row: number; col: number } | null;
  selectedClue: Clue | null;
  difficulty: DifficultyLevel;
}

export interface Statistics {
  gamesPlayed: number;
  gamesCompleted: number;
  totalHintsUsed: number;
  totalTime: number;
  averageTime: number;
  bestTime: number;
  completionPercentage: number;
  byDifficulty: {
    [key in DifficultyLevel]: {
      played: number;
      completed: number;
      totalTime: number;
      bestTime: number;
      hintsUsed: number;
    };
  };
}

export interface Settings {
  soundEnabled: boolean;
  timerEnabled: boolean;
  showErrors: boolean;
  defaultDifficulty: DifficultyLevel;
  theme: 'light' | 'dark';
  hapticsEnabled: boolean;
  tutorialCompleted: boolean;
}

export interface WordEntry {
  word: string;
  clue: string;
  difficulty: DifficultyLevel[];
}
