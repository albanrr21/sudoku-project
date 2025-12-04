"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, CheckCircle, XCircle } from "lucide-react"

interface RecursionStep {
  row: number
  col: number
  value: number
  depth: number
  success: boolean
  backtrack?: boolean
}

export function RecursionTree({ steps }: { steps: RecursionStep[] }) {
  if (steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recursion Tree</CardTitle>
          <CardDescription>The recursion tree will appear here when you start solving</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No recursion steps yet. Click "Solve" to begin.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursion Tree Visualization</CardTitle>
        <CardDescription>Each step shows the algorithm's decision path through the solution space</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                style={{ marginLeft: `${step.depth * 20}px` }}
              >
                {step.backtrack ? (
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                ) : step.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                )}
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-mono">
                    Cell ({step.row}, {step.col})
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={step.backtrack ? "destructive" : "secondary"}>{step.value}</Badge>
                  <Badge variant="outline">Depth: {step.depth}</Badge>
                  {step.backtrack && <span className="text-xs text-destructive">Backtracking...</span>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
