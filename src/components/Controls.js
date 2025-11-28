import React from "react";
import "./Controls.css";

const Controls = ({ onSolve, onGenerate, onClearBoard, stats, difficulty, onDifficultyChange }) => {
  return (
    <div className='controls'>
      <h3>Puzzle Setup</h3>
      
      <div className="difficulty-selector">
        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <button onClick={onGenerate}>Generate New Puzzle</button>
      <button onClick={onClearBoard}>Start Empty Sudoku</button>
      
      <hr />
      
      <h3>Solve & Analyze</h3>
      <button onClick={() => onSolve(true)}>Solve Instantly</button>
      <button onClick={() => onSolve(false)}>
        Visualize Solve
      </button>
      
      <div className='stats-box'>
        <h4>Solver Stats:</h4>
        <p>Recursive Calls: <strong>{stats.calls}</strong></p>
        <p>Backtracks: <strong>{stats.backtracks}</strong></p>
        <p>Time: <strong>{(stats.time / 1000).toFixed(2)}s</strong></p>
      </div>
    </div>
  );
};

export default Controls;
