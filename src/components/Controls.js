import React from "react";
import "./Controls.css";

const Controls = ({ onSolve, onGenerate, onClearBoard, stats }) => {
  return (
    <div className='controls'>
      <h3>Puzzle Setup</h3>
      <button onClick={onGenerate}>Generate New Puzzle</button>
      <button onClick={onClearBoard}>Start Empty Sudoku</button>{" "}
      {/* <-- NEW BUTTON */}
      <hr style={{ width: "90%", margin: "15px 0" }} />
      <h3>Solve & Analyze</h3>
      <button onClick={() => onSolve(true)}>Solve Instantly</button>
      <button onClick={() => onSolve(false)}>
        Visualize Solve (Step-by-Step)
      </button>
      <div className='stats-box'>
        <h4>Solver Stats:</h4>
        <p>Recursive Calls: **{stats.calls}**</p>
        <p>Backtracks: **{stats.backtracks}**</p>
        <p>Time: **{(stats.time / 1000).toFixed(2)}s**</p>
      </div>
    </div>
  );
};

export default Controls;
