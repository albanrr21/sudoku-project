import { getShuffledDigits, shuffleArray } from "./utils";
import { EMPTY_GRID } from "../constants/initialBoard";

// Checks if placing 'num' at (r, c) violates any Sudoku constraints.
export const isSafe = (board, r, c, num) => {
  // 1. Check Row Constraint (Sets)
  // Check if 'num' is already present in the current row 'r'.
  for (let col = 0; col < 9; col++) {
    if (board[r][col] === num) {
      return false;
    }
  }

  // 2. Check Column Constraint (Relations)
  // Check if 'num' is already present in the current column 'c'.
  for (let row = 0; row < 9; row++) {
    if (board[row][c] === num) {
      return false;
    }
  }

  // 3. Check 3x3 Box Constraint (Relations/Sets)
  // Find the starting row and column of the 3x3 box that contains (r, c).
  // Integer division (Math.floor) is used to find the box index.
  const boxStartRow = Math.floor(r / 3) * 3;
  const boxStartCol = Math.floor(c / 3) * 3;

  for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
    for (let colOffset = 0; colOffset < 3; colOffset++) {
      if (board[boxStartRow + rowOffset][boxStartCol + colOffset] === num) {
        return false;
      }
    }
  }

  // If none of the constraints are violated, the placement is safe (valid)
  return true;
};

// Finds the next empty cell (value 0).
export const findEmptyCell = (board) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        return [r, c]; // Return as [row, col]
      }
    }
  }
  return null; // Board is full
};

export const generateFullBoard = (board) => {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    return true; // Board is full
  }

  const [r, c] = emptyCell;
  const shuffledDigits = getShuffledDigits(); // Get a random order of 1-9

  for (const num of shuffledDigits) {
    if (isSafe(board, r, c, num)) {
      board[r][c] = num;
      if (generateFullBoard(board)) {
        return true;
      }
      board[r][c] = 0; // Backtrack
    }
  }
  return false;
};

/**
 * Counts the number of possible solutions for a given board state.
 * This is crucial for ensuring the generated puzzle has a unique solution.
 * @returns {number} The count of solutions found (0, 1, or 2).
 */
export const countSolutions = (board, count = 0) => {
  if (count >= 2) {
    return 2; // Optimization: Stop counting once uniqueness is violated
  }

  const emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    return count + 1; // Found one more solution (Base Case)
  }

  const [r, c] = emptyCell;

  // We must try digits in sequential order here for reliable counting
  for (let num = 1; num <= 9; num++) {
    if (isSafe(board, r, c, num)) {
      board[r][c] = num;

      // Recursive call to find solutions in the next state
      count = countSolutions(board, count);

      board[r][c] = 0; // Backtrack

      if (count >= 2) {
        return 2; // Stop and return 2 if we hit the limit
      }
    }
  }

  return count;
};

/**
 * Generates a playable Sudoku puzzle with a guaranteed unique solution.
 * @param {number} cluesToRemove - The number of cells to empty (e.g., 50).
 * @returns {Array<Array<number>>} The generated puzzle grid.
 */
export const generateUniquePuzzle = (cluesToRemove = 40) => {
  // 1. Create a deep copy of the empty grid
  let board = EMPTY_GRID.map((row) => [...row]);

  // 2. Fill the board completely and randomly
  generateFullBoard(board);

  // 3. Create a list of all 81 cell coordinates in a random order
  let allCells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      allCells.push({ r, c });
    }
  }
  shuffleArray(allCells); // Randomize the order of removal attempts

  let removedCount = 0;

  for (const { r, c } of allCells) {
    if (removedCount >= cluesToRemove) {
      break; // Stop when enough clues are removed
    }

    const cellValue = board[r][c];

    // TEMPORARILY remove the number
    board[r][c] = 0;

    // Check for uniqueness on the modified board (Math: Counting)
    const solutions = countSolutions(board);

    if (solutions === 1) {
      // Uniqueness maintained! Keep the number removed.
      removedCount++;
    } else {
      // Uniqueness violated or no solutions found! Revert the removal.
      board[r][c] = cellValue;
    }
  }

  return board;
};

/**
 * The Recursive Backtracking Solver (Generator Function)
 * This function is the core of the project. It uses 'yield' to pause
 * the recursion, allowing the React component to visualize the steps.
 * * @param {Array<Array<number>>} board - The current state of the Sudoku board.
 * @returns {boolean} True if the board is solved.
 */
export function* solveSudoku(board) {
  // 1. Base Case (Success)
  // Find the next empty cell (value 0). If none, the board is solved.
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    return true;
  }

  const [r, c] = emptyCell;

  // 2. Recursive Step: Try numbers 1 through 9
  for (let num = 1; num <= 9; num++) {
    // Check if placing 'num' here is legal
    if (isSafe(board, r, c, num)) {
      // CHOICE: Place the number
      board[r][c] = num;

      // YIELD STATE (Visualization Point 1: Placement)
      // This is where React will pause and update the UI.
      yield {
        type: "PLACE",
        board: board.map((row) => [...row]), // Pass a copy
        r,
        c,
        num,
      };

      // RECURSE: Try to solve the rest of the board
      // The 'yield*' is necessary for recursive generator calls
      if (yield* solveSudoku(board)) {
        return true; // SUCCESS: Found a solution
      }

      // BACKTRACK (Failure): Undo the choice
      board[r][c] = 0;

      // YIELD STATE (Visualization Point 2: Backtrack)
      yield {
        type: "BACKTRACK",
        board: board.map((row) => [...row]), // Pass a copy
        r,
        c,
      };
    }
  }

  // Failure: If the loop finishes without finding a solution, backtrack
  return false;
}
