"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface SudokuBoardProps {
  board: number[][]
  initialBoard: number[][]
  onChange: (row: number, col: number, value: number) => void
  selectedCell: [number, number] | null
  onSelectCell: (cell: [number, number] | null) => void
}

export function SudokuBoard({ board, initialBoard, onChange, selectedCell, onSelectCell }: SudokuBoardProps) {
  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key >= "1" && e.key <= "9") {
      onChange(row, col, Number.parseInt(e.key))
    } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
      onChange(row, col, 0)
    } else if (e.key === "ArrowUp" && row > 0) {
      onSelectCell([row - 1, col])
    } else if (e.key === "ArrowDown" && row < 8) {
      onSelectCell([row + 1, col])
    } else if (e.key === "ArrowLeft" && col > 0) {
      onSelectCell([row, col - 1])
    } else if (e.key === "ArrowRight" && col < 8) {
      onSelectCell([row, col + 1])
    }
  }

  return (
    <div className="inline-block p-2 bg-card rounded-lg border shadow-lg">
      <div className="grid grid-cols-9 gap-0">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isInitial = initialBoard[rowIndex][colIndex] !== 0
            const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
            const isInSameRow = selectedCell?.[0] === rowIndex
            const isInSameCol = selectedCell?.[1] === colIndex
            const isInSameBox =
              selectedCell &&
              Math.floor(selectedCell[0] / 3) === Math.floor(rowIndex / 3) &&
              Math.floor(selectedCell[1] / 3) === Math.floor(colIndex / 3)

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-xl font-semibold transition-colors",
                  "border-r border-b border-border/50",
                  colIndex % 3 === 2 && colIndex !== 8 && "border-r-2 border-r-foreground",
                  rowIndex % 3 === 2 && rowIndex !== 8 && "border-b-2 border-b-foreground",
                  isInitial
                    ? "bg-primary/5 text-foreground font-bold cursor-not-allowed"
                    : "bg-background text-primary hover:bg-accent cursor-pointer",
                  isSelected && "bg-primary/20 ring-2 ring-primary",
                  !isSelected && (isInSameRow || isInSameCol || isInSameBox) && "bg-accent/50",
                  cell === 0 && "text-muted-foreground/30",
                )}
                onClick={() => onSelectCell([rowIndex, colIndex])}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                disabled={isInitial}
                tabIndex={isInitial ? -1 : 0}
              >
                {cell !== 0 ? cell : ""}
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
