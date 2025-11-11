import { CrosswordData, Cell, Clue, DifficultyLevel, WordEntry } from '../types';
import { getWordsByDifficulty } from '../data/wordDatabase';

interface PlacedWord {
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
}

const GRID_SIZES = {
  easy: 9,
  medium: 11,
  hard: 13,
  expert: 15,
};

const TARGET_WORDS = {
  easy: 8,
  medium: 12,
  hard: 16,
  expert: 20,
};

export const generateCrossword = (difficulty: DifficultyLevel): CrosswordData => {
  const size = GRID_SIZES[difficulty];
  const targetWords = TARGET_WORDS[difficulty];
  const availableWords = getWordsByDifficulty(difficulty);

  // Shuffle words
  const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);

  // Initialize empty grid
  const grid: Cell[][] = Array(size).fill(null).map((_, row) =>
    Array(size).fill(null).map((_, col) => ({
      row,
      col,
      letter: '',
      correctLetter: '',
      isBlack: true,
      isHighlighted: false,
      number: undefined,
    }))
  );

  const placedWords: PlacedWord[] = [];

  // Place first word horizontally in the middle
  const firstWord = shuffledWords[0];
  const firstStartCol = Math.floor((size - firstWord.word.length) / 2);
  const firstStartRow = Math.floor(size / 2);

  placeWord(grid, firstWord.word, firstStartRow, firstStartCol, 'across');
  placedWords.push({
    word: firstWord.word,
    clue: firstWord.clue,
    startRow: firstStartRow,
    startCol: firstStartCol,
    direction: 'across',
  });

  // Try to place remaining words
  let wordsPlaced = 1;
  let attempts = 0;
  const maxAttempts = shuffledWords.length * 10;

  while (wordsPlaced < targetWords && attempts < maxAttempts) {
    const wordEntry = shuffledWords[attempts % shuffledWords.length];
    attempts++;

    if (placedWords.some(pw => pw.word === wordEntry.word)) {
      continue;
    }

    // Try to find intersection with existing words
    const placement = findBestPlacement(grid, wordEntry.word, placedWords, size);

    if (placement) {
      placeWord(grid, wordEntry.word, placement.row, placement.col, placement.direction);
      placedWords.push({
        word: wordEntry.word,
        clue: wordEntry.clue,
        startRow: placement.row,
        startCol: placement.col,
        direction: placement.direction,
      });
      wordsPlaced++;
    }
  }

  // Number the grid and create clues
  const { numberedGrid, clues } = numberGridAndCreateClues(grid, placedWords, size);

  return {
    id: `crossword_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    difficulty,
    grid: numberedGrid,
    clues: {
      across: clues.filter(c => c.direction === 'across'),
      down: clues.filter(c => c.direction === 'down'),
    },
    size,
    title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Crossword`,
    author: 'Crossword Master',
  };
};

const placeWord = (
  grid: Cell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: 'across' | 'down'
): void => {
  for (let i = 0; i < word.length; i++) {
    const row = direction === 'across' ? startRow : startRow + i;
    const col = direction === 'across' ? startCol + i : startCol;

    if (grid[row] && grid[row][col]) {
      grid[row][col].isBlack = false;
      grid[row][col].correctLetter = word[i];
    }
  }
};

const findBestPlacement = (
  grid: Cell[][],
  word: string,
  placedWords: PlacedWord[],
  size: number
): { row: number; col: number; direction: 'across' | 'down' } | null => {
  const possiblePlacements: Array<{ row: number; col: number; direction: 'across' | 'down'; score: number }> = [];

  // For each placed word, try to find intersections
  for (const placedWord of placedWords) {
    for (let i = 0; i < placedWord.word.length; i++) {
      const placedLetter = placedWord.word[i];

      for (let j = 0; j < word.length; j++) {
        if (word[j] === placedLetter) {
          // Try perpendicular placement
          const direction = placedWord.direction === 'across' ? 'down' : 'across';

          let row: number, col: number;

          if (placedWord.direction === 'across') {
            row = placedWord.startRow - j;
            col = placedWord.startCol + i;
          } else {
            row = placedWord.startRow + i;
            col = placedWord.startCol - j;
          }

          if (canPlaceWord(grid, word, row, col, direction, size)) {
            const score = calculatePlacementScore(grid, word, row, col, direction);
            possiblePlacements.push({ row, col, direction, score });
          }
        }
      }
    }
  }

  // Sort by score and return best
  if (possiblePlacements.length > 0) {
    possiblePlacements.sort((a, b) => b.score - a.score);
    return possiblePlacements[0];
  }

  return null;
};

const canPlaceWord = (
  grid: Cell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: 'across' | 'down',
  size: number
): boolean => {
  // Check bounds
  if (direction === 'across') {
    if (startRow < 0 || startRow >= size || startCol < 0 || startCol + word.length > size) {
      return false;
    }

    // Check space before and after
    if (startCol > 0 && grid[startRow][startCol - 1] && !grid[startRow][startCol - 1].isBlack) {
      return false;
    }
    if (startCol + word.length < size && grid[startRow][startCol + word.length] && !grid[startRow][startCol + word.length].isBlack) {
      return false;
    }
  } else {
    if (startCol < 0 || startCol >= size || startRow < 0 || startRow + word.length > size) {
      return false;
    }

    // Check space before and after
    if (startRow > 0 && grid[startRow - 1][startCol] && !grid[startRow - 1][startCol].isBlack) {
      return false;
    }
    if (startRow + word.length < size && grid[startRow + word.length][startCol] && !grid[startRow + word.length][startCol].isBlack) {
      return false;
    }
  }

  // Check each position
  for (let i = 0; i < word.length; i++) {
    const row = direction === 'across' ? startRow : startRow + i;
    const col = direction === 'across' ? startCol + i : startCol;

    if (!grid[row] || !grid[row][col]) {
      return false;
    }

    const cell = grid[row][col];

    // If cell is occupied, must match
    if (!cell.isBlack && cell.correctLetter !== '' && cell.correctLetter !== word[i]) {
      return false;
    }

    // Check perpendicular cells
    if (direction === 'across') {
      if (row > 0 && grid[row - 1][col] && !grid[row - 1][col].isBlack && cell.isBlack) {
        return false;
      }
      if (row < size - 1 && grid[row + 1][col] && !grid[row + 1][col].isBlack && cell.isBlack) {
        return false;
      }
    } else {
      if (col > 0 && grid[row][col - 1] && !grid[row][col - 1].isBlack && cell.isBlack) {
        return false;
      }
      if (col < size - 1 && grid[row][col + 1] && !grid[row][col + 1].isBlack && cell.isBlack) {
        return false;
      }
    }
  }

  return true;
};

const calculatePlacementScore = (
  grid: Cell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: 'across' | 'down'
): number => {
  let score = 0;

  for (let i = 0; i < word.length; i++) {
    const row = direction === 'across' ? startRow : startRow + i;
    const col = direction === 'across' ? startCol + i : startCol;

    if (!grid[row][col].isBlack) {
      score += 10; // Bonus for intersecting
    }
  }

  return score;
};

const numberGridAndCreateClues = (
  grid: Cell[][],
  placedWords: PlacedWord[],
  size: number
): { numberedGrid: Cell[][]; clues: Clue[] } => {
  const numberedGrid = JSON.parse(JSON.stringify(grid));
  const clues: Clue[] = [];
  let clueNumber = 1;

  const wordStarts = new Map<string, number>();

  // First, identify all word start positions
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (numberedGrid[row][col].isBlack) continue;

      const needsNumber =
        (col === 0 || numberedGrid[row][col - 1].isBlack) && col < size - 1 && !numberedGrid[row][col + 1].isBlack ||
        (row === 0 || numberedGrid[row - 1][col].isBlack) && row < size - 1 && !numberedGrid[row + 1][col].isBlack;

      if (needsNumber) {
        numberedGrid[row][col].number = clueNumber;
        wordStarts.set(`${row},${col}`, clueNumber);
        clueNumber++;
      }
    }
  }

  // Create clues from placed words
  for (const placedWord of placedWords) {
    const key = `${placedWord.startRow},${placedWord.startCol}`;
    const number = wordStarts.get(key) || 1;

    clues.push({
      number,
      clue: placedWord.clue,
      answer: placedWord.word,
      startRow: placedWord.startRow,
      startCol: placedWord.startCol,
      direction: placedWord.direction,
      length: placedWord.word.length,
    });
  }

  // Sort clues by number
  clues.sort((a, b) => a.number - b.number);

  return { numberedGrid, clues };
};
