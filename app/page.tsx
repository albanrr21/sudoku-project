"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Timer, Undo, Redo, Zap } from "lucide-react"
import { SudokuBoard } from "@/components/sudoku-board"
import { RecursionTree } from "@/components/recursion-tree"
import { Statistics } from "@/components/statistics"
import { ThemeToggle } from "@/components/theme-toggle"
import { solveSudoku, generatePuzzle, solveSudokuSyncWithStats } from "@/lib/solver"

export default function SudokuSolver() {
  const [board, setBoard] = useState<number[][]>([])
  const [initialBoard, setInitialBoard] = useState<number[][]>([])
  const [history, setHistory] = useState<number[][][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [solving, setSolving] = useState(false)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState([50])
  const [recursionSteps, setRecursionSteps] = useState<any[]>([])
  const [stats, setStats] = useState({
    recursiveCalls: 0,
    backtracks: 0,
    cellsExplored: 0,
    timeTaken: 0,
    maxDepth: 0,
  })
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const shouldStopRef = useRef(false)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  useEffect(() => {
    const newBoard = generatePuzzle("medium")
    setBoard(newBoard)
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)))
    addToHistory(newBoard)
  }, [])

  useEffect(() => {
    if (solving && !paused) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [solving, paused])

  const addToHistory = (newBoard: number[][]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(newBoard)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleCellChange = (row: number, col: number, value: number) => {
    if (initialBoard[row][col] !== 0 || solving) return
    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = value
    setBoard(newBoard)
    addToHistory(newBoard)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setBoard(JSON.parse(JSON.stringify(history[historyIndex - 1])))
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setBoard(JSON.parse(JSON.stringify(history[historyIndex + 1])))
    }
  }

  const handleSolve = async () => {
    shouldStopRef.current = false
    setSolving(true)
    setPaused(false)
    setTimer(0)
    setRecursionSteps([])
    setStats({
      recursiveCalls: 0,
      backtracks: 0,
      cellsExplored: 0,
      timeTaken: 0,
      maxDepth: 0,
    })

    const startTime = Date.now()
    const delay = (101 - speed[0]) * 10
    const boardCopy = board.map((row) => [...row])

    await solveSudoku(
      boardCopy,
      setBoard,
      delay,
      setRecursionSteps,
      setStats,
      () => paused,
      () => shouldStopRef.current,
    )

    const timeTaken = (Date.now() - startTime) / 1000
    setStats((prev) => ({ ...prev, timeTaken }))
    setSolving(false)
  }

  const handleInstantSolve = () => {
    const boardCopy = board.map((row) => [...row])
    const startTime = Date.now()

    const result = solveSudokuSyncWithStats(boardCopy)

    if (result.solved) {
      setBoard(boardCopy)
      const timeTaken = (Date.now() - startTime) / 1000
      setStats({
        ...result.stats,
        timeTaken,
      })
    }
  }

  const handleReset = () => {
    shouldStopRef.current = true
    setBoard(JSON.parse(JSON.stringify(initialBoard)))
    setSolving(false)
    setPaused(false)
    setTimer(0)
    setRecursionSteps([])
    setStats({
      recursiveCalls: 0,
      backtracks: 0,
      cellsExplored: 0,
      timeTaken: 0,
      maxDepth: 0,
    })
    setHistory([JSON.parse(JSON.stringify(initialBoard))])
    setHistoryIndex(0)
  }

  const handleNewPuzzle = (difficulty: "easy" | "medium" | "hard") => {
    shouldStopRef.current = true
    const newBoard = generatePuzzle(difficulty)
    setBoard(newBoard)
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)))
    setSolving(false)
    setPaused(false)
    setTimer(0)
    setRecursionSteps([])
    setStats({
      recursiveCalls: 0,
      backtracks: 0,
      cellsExplored: 0,
      timeTaken: 0,
      maxDepth: 0,
    })
    setHistory([JSON.parse(JSON.stringify(newBoard))])
    setHistoryIndex(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sudoku Recursion Visualizer</h1>
          <p className="text-muted-foreground text-lg">Watch the backtracking algorithm solve puzzles in real-time</p>
        </div>

        <Tabs defaultValue="solver" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="solver">Solver</TabsTrigger>
            <TabsTrigger value="recursion">Recursion Tree</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="solver" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <Card>
                <CardHeader>
                  <CardTitle>Puzzle Board</CardTitle>
                  <CardDescription>Click cells to enter numbers or watch the algorithm solve it</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <SudokuBoard
                    board={board}
                    initialBoard={initialBoard}
                    onChange={handleCellChange}
                    selectedCell={selectedCell}
                    onSelectCell={setSelectedCell}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Timer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-mono font-bold text-center">{formatTime(timer)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Speed</label>
                      <Slider value={speed} onValueChange={setSpeed} min={1} max={100} step={1} disabled={solving} />
                      <div className="text-xs text-muted-foreground text-center">{speed[0]}% speed</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {!solving ? (
                        <Button onClick={handleSolve} className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Solve
                        </Button>
                      ) : (
                        <Button onClick={() => setPaused(!paused)} variant="secondary" className="w-full">
                          {paused ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </>
                          ) : (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          )}
                        </Button>
                      )}
                      <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>

                    <Button onClick={handleInstantSolve} variant="secondary" className="w-full" disabled={solving}>
                      <Zap className="h-4 w-4 mr-2" />
                      Instant Solve
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleUndo}
                        variant="outline"
                        disabled={historyIndex <= 0 || solving}
                        className="w-full bg-transparent"
                      >
                        <Undo className="h-4 w-4 mr-2" />
                        Undo
                      </Button>
                      <Button
                        onClick={handleRedo}
                        variant="outline"
                        disabled={historyIndex >= history.length - 1 || solving}
                        className="w-full"
                      >
                        <Redo className="h-4 w-4 mr-2" />
                        Redo
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium mb-2 block">New Puzzle</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button onClick={() => handleNewPuzzle("easy")} variant="outline" size="sm" disabled={solving}>
                          Easy
                        </Button>
                        <Button
                          onClick={() => handleNewPuzzle("medium")}
                          variant="outline"
                          size="sm"
                          disabled={solving}
                        >
                          Medium
                        </Button>
                        <Button onClick={() => handleNewPuzzle("hard")} variant="outline" size="sm" disabled={solving}>
                          Hard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Live Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Recursive Calls</span>
                      <Badge variant="secondary">{stats.recursiveCalls}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Backtracks</span>
                      <Badge variant="secondary">{stats.backtracks}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cells Explored</span>
                      <Badge variant="secondary">{stats.cellsExplored}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Depth</span>
                      <Badge variant="secondary">{stats.maxDepth}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recursion">
            <RecursionTree steps={recursionSteps} />
          </TabsContent>

          <TabsContent value="stats">
            <Statistics stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
