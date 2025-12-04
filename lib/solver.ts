import type React from "react"

export function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false
  }

  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false
  }

  const startRow = row - (row % 3)
  const startCol = col - (col % 3)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false
    }
  }

  return true
}

export async function solveSudoku(
  board: number[][],
  setBoard: (board: number[][]) => void,
  delay: number,
  setRecursionSteps: React.Dispatch<React.SetStateAction<any[]>>,
  setStats: React.Dispatch<React.SetStateAction<any>>,
  isPaused: () => boolean,
  shouldStop: () => boolean,
  depth = 0,
): Promise<boolean> {
  if (shouldStop()) {
    return false
  }

  while (isPaused()) {
    if (shouldStop()) {
      return false
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  setStats((prev: any) => ({
    ...prev,
    recursiveCalls: prev.recursiveCalls + 1,
    maxDepth: Math.max(prev.maxDepth, depth),
  }))

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        setStats((prev: any) => ({
          ...prev,
          cellsExplored: prev.cellsExplored + 1,
        }))

        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num
            setBoard([...board])
            setRecursionSteps((prev) => [...prev, { row, col, value: num, depth, success: false }])

            await new Promise((resolve) => setTimeout(resolve, delay))

            if (
              await solveSudoku(board, setBoard, delay, setRecursionSteps, setStats, isPaused, shouldStop, depth + 1)
            ) {
              setRecursionSteps((prev) => [...prev.slice(0, -1), { row, col, value: num, depth, success: true }])
              return true
            }

            board[row][col] = 0
            setBoard([...board])
            setRecursionSteps((prev) => [...prev, { row, col, value: num, depth, success: false, backtrack: true }])
            setStats((prev: any) => ({
              ...prev,
              backtracks: prev.backtracks + 1,
            }))

            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
        return false
      }
    }
  }
  return true
}

export function generatePuzzle(difficulty: "easy" | "medium" | "hard"): number[][] {
  const board: number[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0))

  fillDiagonalBoxes(board)
  solveSudokuSync(board)

  const cellsToRemove = difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 55
  removeNumbers(board, cellsToRemove)

  return board
}

function fillDiagonalBoxes(board: number[][]) {
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box)
  }
}

function fillBox(board: number[][], row: number, col: number) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * nums.length)
      board[row + i][col + j] = nums[randomIndex]
      nums.splice(randomIndex, 1)
    }
  }
}

export function solveSudokuSync(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num
            if (solveSudokuSync(board)) return true
            board[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function removeNumbers(board: number[][], count: number) {
  let removed = 0
  while (removed < count) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (board[row][col] !== 0) {
      board[row][col] = 0
      removed++
    }
  }
}

export function solveSudokuSyncWithStats(board: number[][]): {
  solved: boolean
  stats: {
    recursiveCalls: number
    backtracks: number
    cellsExplored: number
    maxDepth: number
  }
} {
  const stats = {
    recursiveCalls: 0,
    backtracks: 0,
    cellsExplored: 0,
    maxDepth: 0,
  }

  function solve(depth = 0): boolean {
    stats.recursiveCalls++
    stats.maxDepth = Math.max(stats.maxDepth, depth)

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          stats.cellsExplored++

          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num
              if (solve(depth + 1)) return true
              board[row][col] = 0
              stats.backtracks++
            }
          }
          return false
        }
      }
    }
    return true
  }

  const solved = solve()
  return { solved, stats }
}
