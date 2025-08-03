import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkipForward, RotateCcw } from "lucide-react";
import type { WordItem } from "@/lib/types";

interface TypingAreaProps {
  words: WordItem[];
  currentWordIndex: number;
  onWordComplete: (
    wordIndex: number,
    userInput: string,
    isCorrect: boolean
  ) => void;
  onNextWord: () => void;
  onReset: () => void;
  timeRemaining: number;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  currentWordIndex,
  onWordComplete,
  onNextWord,
  onReset,
  timeRemaining,
}) => {
  const [currentInput, setCurrentInput] = useState("");
  const [showDefinition, setShowDefinition] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentWordIndex];
  const isTimerExpired = timeRemaining <= 0;

  useEffect(() => {
    if (!isTimerExpired) {
      inputRef.current?.focus();
    }
  }, [currentWordIndex, isTimerExpired]);

  useEffect(() => {
    setCurrentInput("");
  }, [currentWordIndex]);

  const handleInputChange = (value: string) => {
    if (isTimerExpired) return; // Block input when timer is expired

    setCurrentInput(value);

    // Check if word is complete (exact match)
    if (
      currentWord &&
      value.toLowerCase().trim() === currentWord.word.toLowerCase()
    ) {
      onWordComplete(currentWordIndex, value, true);
      setTimeout(() => {
        onNextWord();
      }, 100);
    }
  };

  const handleSkip = () => {
    if (isTimerExpired) return; // Block skip when timer is expired

    if (currentWord) {
      onWordComplete(currentWordIndex, currentInput, false);
    }
    onNextWord();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isTimerExpired) return; // Block keyboard shortcuts when timer is expired

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleSkip();
    }
  };

  const getWordClassName = (word: WordItem, index: number) => {
    if (index === currentWordIndex) {
      return word.isDevTerm
        ? "bg-blue-200 text-blue-900 px-2 py-1 rounded font-semibold border-2 border-blue-400"
        : "bg-gray-200 text-gray-900 px-2 py-1 rounded border-2 border-gray-400";
    }

    if (word.isCompleted) {
      if (word.isDevTerm) {
        return word.isCorrect
          ? "bg-green-100 text-green-800 px-2 py-1 rounded cursor-pointer hover:bg-green-200"
          : "bg-red-100 text-red-800 px-2 py-1 rounded cursor-pointer hover:bg-red-200 line-through";
      }
      return word.isCorrect ? "text-green-600" : "text-red-600 line-through";
    }

    if (word.isDevTerm) {
      return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium";
    }

    return "text-gray-700";
  };

  const handleWordClick = (word: WordItem, index: number) => {
    if (word.isCompleted && word.isDevTerm) {
      setShowDefinition(showDefinition === index ? null : index);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Timer and Controls */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Time: {formatTime(timeRemaining)}
        </Badge>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Sentence Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-lg leading-relaxed space-x-1 mb-6 min-h-[120px]">
            {words.map((word, index) => (
              <span key={word.id} className="relative">
                <span
                  className={`${getWordClassName(
                    word,
                    index
                  )} transition-all duration-200`}
                  onClick={() => handleWordClick(word, index)}
                >
                  {word.word}
                </span>
                {showDefinition === index && word.definition && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10 max-w-xs">
                    <div className="font-semibold mb-1">{word.word}</div>
                    <div>{word.definition}</div>
                  </div>
                )}
                {index < words.length - 1 && " "}
              </span>
            ))}
          </div>

          {/* Current Word Info */}
          {currentWord && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Type:{" "}
                  <span className="font-mono font-semibold">
                    {currentWord.word}
                  </span>
                </span>
                {currentWord.isDevTerm && (
                  <Badge variant="secondary">Dev Term</Badge>
                )}
              </div>
              {currentWord.isDevTerm && currentWord.definition && (
                <div className="text-xs text-gray-500">
                  💡 {currentWord.definition}
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isTimerExpired
                  ? "Time's up! Session completed."
                  : currentWord
                  ? `Type "${currentWord.word}"...`
                  : "Loading..."
              }
              className={`flex-1 text-lg ${
                isTimerExpired ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={!currentWord || isTimerExpired}
            />
            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={!currentWord || isTimerExpired}
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip (Space)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600">
        {isTimerExpired ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600 mb-2">
              ⏰ Time's Up!
            </p>
            <p>Your typing session has ended. Check your stats below!</p>
          </div>
        ) : (
          <>
            <p>
              Type the current word exactly as shown, then press SPACE or click
              Skip to continue
            </p>
            <p>
              Click on completed dev terms (colored words) to see their
              definitions
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TypingArea;
