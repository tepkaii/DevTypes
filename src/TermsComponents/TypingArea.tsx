import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";
import type { WordItem } from "@/lib/types";
import { SkipNextSolid } from "iconoir-react";

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
  isSessionActive: boolean;
  sessionCompleted: boolean;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  currentWordIndex,
  onWordComplete,
  onNextWord,
  onReset,
  timeRemaining,
  isSessionActive,
  sessionCompleted,
}) => {
  const [currentInput, setCurrentInput] = useState("");
  const [showDefinition, setShowDefinition] = useState<number | null>(null);
  const [inputStatus, setInputStatus] = useState<
    "neutral" | "correct" | "error"
  >("neutral");
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentWordIndex];
  const isTimerExpired = timeRemaining <= 0;

  useEffect(() => {
    if (!isTimerExpired && isSessionActive) {
      inputRef.current?.focus();
    }
  }, [currentWordIndex, isTimerExpired, isSessionActive]);

  useEffect(() => {
    setCurrentInput("");
    setInputStatus("neutral");
  }, [currentWordIndex]);

  // Real-time input validation
  useEffect(() => {
    if (!currentWord || !currentInput) {
      setInputStatus("neutral");
      return;
    }

    const targetWord = currentWord.word.toLowerCase();
    const userInput = currentInput.toLowerCase();

    if (targetWord === userInput) {
      setInputStatus("correct");
    } else if (targetWord.startsWith(userInput)) {
      setInputStatus("correct");
    } else {
      setInputStatus("error");
    }
  }, [currentInput, currentWord]);

  const handleInputChange = (value: string) => {
    if (isTimerExpired || !isSessionActive) return;

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
    if (isTimerExpired || !isSessionActive) return;

    if (currentWord) {
      onWordComplete(currentWordIndex, currentInput, false);
    }
    onNextWord();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isTimerExpired || !isSessionActive) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleSkip();
    }
  };

  const getWordClassName = (word: WordItem, index: number) => {
    if (word.isCompleted) {
      if (word.isDevTerm) {
        return word.isCorrect
          ? "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300 px-2 py-1 rounded cursor-pointer hover:bg-green-200 dark:hover:bg-green-950/50 border border-green-300"
          : "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300 px-2 py-1 rounded cursor-pointer hover:bg-red-200 dark:hover:bg-red-950/50 line-through border border-red-300";
      }
      return word.isCorrect
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400 line-through";
    }

    if (word.isDevTerm && index !== currentWordIndex) {
      return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded font-medium border border-yellow-300";
    }

    return "text-foreground";
  };

  const renderCurrentWord = (word: WordItem) => {
    if (!currentInput) {
      return (
        <span
          className={
            word.isDevTerm
              ? "bg-primary text-primary-foreground px-2 py-1 rounded font-semibold border-2 border-primary"
              : "bg-secondary text-secondary-foreground px-2 py-1 rounded border-2 border-border"
          }
        >
          {word.word}
        </span>
      );
    }

    // const targetWord = word.word.toLowerCase();
    const userInput = currentInput.toLowerCase();
    const chars = word.word.split("");

    return (
      <span
        className={
          word.isDevTerm
            ? "px-2 py-1 rounded font-semibold border-2 border-primary"
            : "px-2 py-1 rounded border-2 border-border"
        }
      >
        {chars.map((char, charIndex) => {
          const userChar = userInput[charIndex];
          let className = "";

          if (userChar === undefined) {
            // Not typed yet
            className = "bg-secondary text-secondary-foreground";
          } else if (userChar === char.toLowerCase()) {
            // Correct character
            className =
              "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300";
          } else {
            // Wrong character
            className =
              "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300";
          }

          return (
            <span key={charIndex} className={className}>
              {char}
            </span>
          );
        })}
        {/* Show extra characters if user typed more */}
        {userInput.length > word.word.length && (
          <span className="bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300">
            {currentInput.slice(word.word.length)}
          </span>
        )}
      </span>
    );
  };

  const renderTypedCharacters = () => {
    if (!currentWord || !currentInput) return null;

    const targetWord = currentWord.word.toLowerCase();
    // const userInput = currentInput.toLowerCase();
    const chars = currentInput.split("");

    return (
      <span>
        {chars.map((char, charIndex) => {
          const targetChar = targetWord[charIndex];
          let className = "";

          if (targetChar && char === targetChar) {
            // Correct character
            className =
              "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300";
          } else {
            // Wrong character or extra character
            className =
              "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300";
          }

          return (
            <span key={charIndex} className={className}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  const getInputClassName = () => {
    let baseClasses = "flex-1 text-lg border-border";

    if (isTimerExpired || !isSessionActive) {
      return `${baseClasses} bg-muted cursor-not-allowed`;
    }

    switch (inputStatus) {
      case "correct":
        return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-950/20 focus:ring-green-500`;
      case "error":
        return `${baseClasses} border-red-500 bg-red-50 dark:bg-red-950/20 focus:ring-red-500`;
      default:
        return `${baseClasses} bg-background`;
    }
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
        <Badge variant="outline" className="text-lg px-4 py-2 border-border">
          Time: {formatTime(timeRemaining)}
        </Badge>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Sentence Display */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="text-lg leading-relaxed space-x-1 mb-6 min-h-[120px]">
            {words.map((word, index) => (
              <span key={word.id} className="relative">
                {index === currentWordIndex ? (
                  renderCurrentWord(word)
                ) : (
                  <span
                    className={`${getWordClassName(
                      word,
                      index
                    )} transition-all duration-200`}
                    onClick={() => handleWordClick(word, index)}
                  >
                    {word.word}
                  </span>
                )}
                {showDefinition === index && word.definition && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg z-10 max-w-xs border border-border">
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
            <div className="mb-4 p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Type:{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {currentWord.word}
                  </span>
                </span>
                {currentWord.isDevTerm && (
                  <Badge variant="secondary">Dev Term</Badge>
                )}
              </div>
              {currentWord.isDevTerm && currentWord.definition && (
                <div className="text-xs text-muted-foreground">
                  💡 {currentWord.definition}
                </div>
              )}
            </div>
          )}

          {/* Custom Typing Display */}
          <div className="flex gap-3">
            <div
              className={`flex-1 text-lg p-3 rounded-md border-2 min-h-[60px] cursor-text focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getInputClassName()}`}
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex flex-wrap gap-1 items-center">
                {currentWord && currentInput ? (
                  <div className="font-mono">{renderTypedCharacters()}</div>
                ) : (
                  <span className="text-muted-foreground">
                    {isTimerExpired
                      ? "Time's up! Session completed."
                      : !isSessionActive && !sessionCompleted
                      ? "Press Start to begin typing..."
                      : currentWord
                      ? "Start typing..."
                      : "Loading..."}
                  </span>
                )}
              </div>

              {/* Hidden input for keyboard handling */}
              <input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="opacity-0 absolute -left-9999px"
                disabled={!currentWord || isTimerExpired || !isSessionActive}
                autoComplete="off"
              />
            </div>

            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={!currentWord || isTimerExpired || !isSessionActive}
            >
              <SkipNextSolid className="size-5 " />
              Skip (Space)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        {isTimerExpired ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              ⏰ Time's Up!
            </p>
            <p>Your typing session has ended. Check your stats below!</p>
          </div>
        ) : !isSessionActive && !sessionCompleted ? (
          <p>Press the Start button to begin your typing session</p>
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
            <div className="flex items-center justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 dark:bg-green-950/30 border border-green-300 rounded"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 dark:bg-red-950/30 border border-red-300 rounded"></div>
                <span>Wrong</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TypingArea;