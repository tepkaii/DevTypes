import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Clock, AlertCircle, Zap } from "lucide-react";
import type { Stats } from "@/lib/types";

interface StatsPanelProps {
  stats: Stats;
  isSessionActive: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, isSessionActive }) => {
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
        <Card className={isSessionActive ? "ring-2 ring-blue-500" : ""}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTime(stats.timeRemaining)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WPM */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">WPM</p>
                <p className={`text-2xl font-bold ${getWpmColor(stats.wpm)}`}>
                  {stats.wpm}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
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
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Words</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.wordsCompleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mistakes */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Mistakes</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.mistakes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      {!isSessionActive && stats.wordsCompleted > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Session Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.wordsCompleted}
                </div>
                <div className="text-blue-800">Words Typed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.correctWords}
                </div>
                <div className="text-green-800">Correct Words</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.wpm}
                </div>
                <div className="text-purple-800">Final WPM</div>
              </div>
            </div>

            <div className="mt-4 text-center">
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
