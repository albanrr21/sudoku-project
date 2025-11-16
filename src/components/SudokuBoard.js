import React from "react";
import Cell from "./Cell";
import "./SudokuBoard.css"; // We'll create this next

const SudokuBoard = ({ board, onInputChange }) => {
  return (
    <div className='sudoku-board'>
      {board.map((row, r) => (
        <React.Fragment key={r}>
          {row.map((cellObject, c) => (
            <Cell
              key={`${r}-${c}`}
              cellObject={cellObject}
              r={r}
              c={c}
              onInputChange={onInputChange} // Passed down
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SudokuBoard;
