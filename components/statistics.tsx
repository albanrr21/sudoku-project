"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Stats {
  recursiveCalls: number
  backtracks: number
  cellsExplored: number
  timeTaken: number
  maxDepth: number
}

export function Statistics({ stats }: { stats: Stats }) {
  const efficiency =
    stats.recursiveCalls > 0 ? ((stats.recursiveCalls - stats.backtracks) / stats.recursiveCalls) * 100 : 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Performance</CardTitle>
          <CardDescription>Metrics from the backtracking algorithm execution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Recursive Calls</span>
              <span className="font-mono font-bold">{stats.recursiveCalls}</span>
            </div>
            <Progress value={Math.min((stats.recursiveCalls / 1000) * 100, 100)} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Backtrack Operations</span>
              <span className="font-mono font-bold text-destructive">{stats.backtracks}</span>
            </div>
            <Progress
              value={Math.min((stats.backtracks / stats.recursiveCalls) * 100, 100)}
              className="bg-destructive/20"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cells Explored</span>
              <span className="font-mono font-bold">{stats.cellsExplored}</span>
            </div>
            <Progress value={Math.min((stats.cellsExplored / 81) * 100, 100)} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Maximum Recursion Depth</span>
              <span className="font-mono font-bold">{stats.maxDepth}</span>
            </div>
            <Progress value={Math.min((stats.maxDepth / 81) * 100, 100)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Efficiency Analysis</CardTitle>
          <CardDescription>How efficiently the algorithm found the solution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Algorithm Efficiency</span>
              <span className="font-mono font-bold">{efficiency.toFixed(1)}%</span>
            </div>
            <Progress value={efficiency} />
            <p className="text-xs text-muted-foreground">
              Percentage of recursive calls that didn't require backtracking
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Taken</span>
              <span className="font-mono font-bold">{stats.timeTaken.toFixed(2)}s</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Backtrack Rate</span>
              <span className="font-mono font-bold">
                {stats.recursiveCalls > 0 ? ((stats.backtracks / stats.recursiveCalls) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Lower is better - indicates fewer dead ends explored</p>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="text-sm font-semibold mb-2">Educational Insight</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The backtracking algorithm explores the solution space recursively. When it encounters an invalid state,
              it "backtracks" to the previous decision point and tries a different path. The depth shows how far into
              the recursion tree the algorithm went.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
