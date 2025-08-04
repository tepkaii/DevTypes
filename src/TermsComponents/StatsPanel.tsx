import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen } from "lucide-react";
import type { Stats, Term } from "@/lib/types";
import { Flash, Medal, Timer, WarningHexagon } from "iconoir-react";

interface StatsPanelProps {
  stats: Stats;
  isSessionActive: boolean;
  sessionCompleted?: boolean;
  usedTerms?: Term[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  isSessionActive,
  sessionCompleted = false,
  usedTerms = [],
}) => {
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-green-600";
    if (accuracy >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const getWpmColor = (wpm: number) => {
    if (wpm >= 60) return "text-green-600";
    if (wpm >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Time Remaining */}
        <Card
          className={`border-border ${
            isSessionActive ? "ring-2 ring-primary" : ""
          }`}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold text-primary">
                  {formatTime(stats.timeRemaining)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WPM */}
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Flash className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">WPM</p>
                <p className={`text-2xl font-bold ${getWpmColor(stats.wpm)}`}>
                  {stats.wpm}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p
                  className={`text-2xl font-bold ${getAccuracyColor(
                    stats.accuracy
                  )}`}
                >
                  {stats.accuracy.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Words Completed */}
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Words</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.wordsCompleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mistakes */}
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <WarningHexagon className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Mistakes</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.mistakes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Used Terms Section */}
      {sessionCompleted && usedTerms.length > 0 && (
        <Card className="mt-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Terms Practiced ({usedTerms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {usedTerms.map((term) => (
                <Badge
                  key={term.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary text-sm px-3 py-1"
                  onClick={() =>
                    setSelectedTerm(selectedTerm?.id === term.id ? null : term)
                  }
                >
                  {term.term}
                </Badge>
              ))}
            </div>

            {selectedTerm && (
              <Card className="bg-muted/50 border-border">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {selectedTerm.term}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedTerm.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTerm.definition}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      {sessionCompleted && stats.wordsCompleted > 0 && (
        <Card className="mt-4 border-border">
          <CardHeader>
            <CardTitle className="text-lg">Session Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary">
                  {stats.wordsCompleted}
                </div>
                <div className="text-muted-foreground">Words Typed</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-border">
                <div className="text-2xl font-bold text-green-600">
                  {stats.correctWords}
                </div>
                <div className="text-muted-foreground">Correct Words</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-border">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.wpm}
                </div>
                <div className="text-muted-foreground">Final WPM</div>
              </div>
            </div>

            <div className="mt-4 text-center space-y-1">
              {stats.accuracy >= 95 && (
                <p className="text-green-600 font-semibold">
                  🎯 Excellent accuracy!
                </p>
              )}
              {stats.wpm >= 50 && (
                <p className="text-blue-600 font-semibold">
                  ⚡ Great typing speed!
                </p>
              )}
              {stats.mistakes <= 3 && (
                <p className="text-purple-600 font-semibold">
                  ✨ Very few mistakes!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsPanel;
