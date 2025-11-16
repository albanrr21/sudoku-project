import React, { useState } from "react";
import SudokuBoard from "./components/SudokuBoard";
import Controls from "./components/Controls";
import { solveSudoku, generateUniquePuzzle } from "./algorithms/solver";
import "./App.css";

// Initial state for tracking stats
const initialStats = {
  calls: 0,
  backtracks: 0,
  time: 0,
};

const createInitialBoardState = (puzzle) => {
  return puzzle.map((row, r) =>
    row.map((value, c) => ({
      value: value,
      isInitial: value !== 0,
      isHighlighted: false, // New property for visualization
      isConflict: false, // New property for marking errors
      isUserPlaced: false,
    }))
  );
};

const extractRawBoard = (objectBoard) => {
  return objectBoard.map((row) => row.map((cell) => cell.value));
};

const initialPuzzle = generateUniquePuzzle(45); // Generate a fresh puzzle on startup

// src/App.js (Add this helper)

/**
 * Maps a new RAW number board onto the existing OBJECT board,
 * preserving the 'isInitial' flag for original clues.
 * @param {Array<Array<object>>} oldObjectBoard - The current state with object cells.
 * @param {Array<Array<number>>} newRawBoard - The new number state from the solver.
 * @returns {Array<Array<object>>} The updated object board for React state.
 */

function App() {
  // State 1: The current board (9x9 array)
  const [board, setBoard] = useState(createInitialBoardState(initialPuzzle));
  // State 2: Stats for the demo
  const [stats, setStats] = useState(initialStats);
  // State 3: Control the visualization speed
  const [delay] = useState(1); // 50ms pause per step
  const handleClearBoard = () => {
    setStats(initialStats);
    setBoard(createEmptyMutableBoard()); // Reset to a fully mutable, empty board
  };
  const handleGenerate = () => {
    setStats(initialStats); // Reset stats

    // Create a new puzzle and update the state
    const newPuzzle = generateUniquePuzzle(45);
    setBoard(createInitialBoardState(newPuzzle));
  };
  const mapRawToInitialObjectBoard = (oldObjectBoard, newRawBoard) => {
    return oldObjectBoard.map((row, r) =>
      row.map((oldCell, c) => {
        // Check if the value has changed OR if the solver is running
        // Assuming the solver is running when this function is called inside handleSolve:
        const isSolverPlacing =
          oldCell.value !== newRawBoard[r][c] || newRawBoard[r][c] !== 0;

        return {
          ...oldCell,
          value: newRawBoard[r][c],
          // Reset isUserPlaced to false if the solver is actively writing to the board.
          // This ensures the solver's output is not colored as user input.
          isUserPlaced: isSolverPlacing ? false : oldCell.isUserPlaced,
        };
      })
    );
  };
  // --- Core Visualization Logic ---
  const handleSolve = async (instant) => {
    setStats(initialStats); // Reset stats before solving
    const currentObjectBoard = board;
    const rawBoard = extractRawBoard(currentObjectBoard);
    // 1. Create the generator object from the solver function
    const solverIterator = solveSudoku(rawBoard);
    //let solved = false;
    let localStats = { calls: 0, backtracks: 0 };
    const startTime = performance.now();

    // 2. Iterate through the generator steps
    for (const step of solverIterator) {
      // Update stats
      localStats.calls++;
      if (step.type === "BACKTRACK") localStats.backtracks++;

      // Update the board state in React
      setBoard((prevBoard) => {
        // 1. Map the raw board to preserve isInitial flags
        let newObjectBoard = mapRawToInitialObjectBoard(prevBoard, step.board);

        // 2. Add highlighing to the current cell (r, c) from the step object
        // Find the cell that was just placed/backtracked
        const { r, c, type } = step;

        if (newObjectBoard[r] && newObjectBoard[r][c]) {
          // Highlight the current cell being processed
          newObjectBoard[r][c].isHighlighted = type === "PLACE";

          // Optional: Highlight cells being considered red during backtrack
          // if (type === 'BACKTRACK') {
          //     newObjectBoard[r][c].isConflict = true;
          // }
        }

        return newObjectBoard;
      }); // If not instant mode, wait for the delay
      if (!instant) {
        // This promise creates the necessary pause for visualization
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const endTime = performance.now();

    // 3. Final stats update
    setStats({
      calls: localStats.calls,
      backtracks: localStats.backtracks,
      time: (endTime - startTime).toFixed(2),
    });

    // Final check and UI update if needed
    // (You can add logic here to show a "Solved!" message)
  };

  const handleInputChange = (r, c, value) => {
    // 1. Convert to number (0 if empty/invalid)
    const num = parseInt(value) || 0;

    // Safety check, ensure you allow clearing the cell (value 0)
    if (num < 0 || num > 9) return;

    setBoard((prevBoard) => {
      // Deep copy of the board rows is essential for React state updates
      const newBoard = prevBoard.map((row) => [...row]);

      // This check should pass for mutable cells
      if (!newBoard[r][c].isInitial) {
        newBoard[r][c].value = num;

        // This is the flag we added last time
        newBoard[r][c].isUserPlaced = num > 0;
      }
      return newBoard; // <-- MUST return the new state
    });

    setStats(initialStats);
  };

  const createEmptyMutableBoard = () => {
    // This assumes you have the EMPTY_GRID imported or defined somewhere (9x9 array of 0s)
    // If not, use a simple array definition:
    const emptyRawGrid = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    return emptyRawGrid.map((row) =>
      row.map((value) => ({
        value: value,
        isInitial: false, // <-- KEY CHANGE: No fixed clues
        isHighlighted: false,
        isConflict: false,
        isUserPlaced: false,
      }))
    );
  };

  // Placeholder for the Generator function (we'll build this next)
  return (
    <div className='App'>
      <h1>Sudoku Solver & Generator</h1>
      <div className='main-content'>
        <SudokuBoard board={board} onInputChange={handleInputChange} />
        <Controls
          onSolve={handleSolve}
          onGenerate={handleGenerate}
          onClearBoard={handleClearBoard}
          stats={stats}
        />
      </div>
    </div>
  );
}

export default App;
