import React from "react";
import "./Cell.css"; // We'll create this next

const Cell = ({ cellObject, r, c, onInputChange }) => {
  const { value, isInitial, isHighlighted, isConflict, isUserPlaced } =
    cellObject;

  // Only display non-zero values
  const displayValue = value === 0 ? "" : value;

  const boxClass = `${(c + 1) % 3 === 0 && c !== 8 ? "border-right" : ""} ${
    (r + 1) % 3 === 0 && r !== 8 ? "border-bottom" : ""
  }`;
  const initialClass = isInitial ? "cell-initial" : "cell-mutable";
  const highlightClass = isHighlighted ? "cell-highlight" : "";
  const conflictClass = isConflict ? "cell-conflict" : "";

  const userPlacedClass = isUserPlaced && !isInitial ? "cell-user-input" : "";

  // If the cell is an initial clue, render a static div.
  if (isInitial) {
    return (
      <div
        className={`cell ${boxClass} ${initialClass} ${highlightClass} ${conflictClass}`}>
        {displayValue}
      </div>
    );
  }

  // If the cell is mutable (user-editable), render a controlled input.
  return (
    <input
      type='number' // Restricts input to numbers
      min='1'
      max='9'
      className={`cell ${boxClass} ${initialClass} ${highlightClass} ${conflictClass} ${userPlacedClass}`}
      value={displayValue} // Controlled input value
      onChange={(e) => onInputChange(r, c, e.target.value)} // Pass handler
    />
  );
};

export default Cell;
