import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause } from "lucide-react";
import TypingArea from "./TypingArea";
import StatsPanel from "./StatsPanel";
import type { SessionDuration, Stats, Term, WordItem } from "@/lib/types";
import { SentenceGenerator } from "@/lib/sentenceGenerator";

interface PracticeViewProps {
  terms: Term[];
  category: string;
  duration: SessionDuration;
  onBack: () => void;
}

const PracticeView: React.FC<PracticeViewProps> = ({
  terms,
  category,
  duration,
  onBack,
}) => {
  const [sentenceGenerator] = useState(() => new SentenceGenerator(terms));
  const [currentWords, setCurrentWords] = useState<WordItem[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 100,
    mistakes: 0,
    totalTyped: 0,
    correctWords: 0,
    timeRemaining: duration,
    wordsCompleted: 0,
  });

  // Initialize first sentence
  useEffect(() => {
    generateNewSentence();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSessionActive && stats.timeRemaining > 0) {
      interval = setInterval(() => {
        setStats((prev) => {
          const newTimeRemaining = prev.timeRemaining - 1;
          if (newTimeRemaining <= 0) {
            setIsSessionActive(false);
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSessionActive, stats.timeRemaining]);

  // Calculate WPM
  useEffect(() => {
    if (sessionStarted && stats.wordsCompleted > 0) {
      const timeElapsed = (duration - stats.timeRemaining) / 60; // minutes
      const wpm =
        timeElapsed > 0 ? Math.round(stats.wordsCompleted / timeElapsed) : 0;
      setStats((prev) => ({ ...prev, wpm }));
    }
  }, [stats.wordsCompleted, stats.timeRemaining, duration, sessionStarted]);

  // Calculate accuracy
  useEffect(() => {
    if (stats.totalTyped > 0) {
      const accuracy = (stats.correctWords / stats.totalTyped) * 100;
      setStats((prev) => ({ ...prev, accuracy }));
    }
  }, [stats.correctWords, stats.totalTyped]);

  const generateNewSentence = useCallback(() => {
    const newWords = sentenceGenerator.generateSentence();
    setCurrentWords(newWords);
    setCurrentWordIndex(0);
  }, [sentenceGenerator]);

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStarted(true);
  };

  const pauseSession = () => {
    setIsSessionActive(false);
  };

  const resetSession = () => {
    setIsSessionActive(false);
    setSessionStarted(false);
    setStats({
      wpm: 0,
      accuracy: 100,
      mistakes: 0,
      totalTyped: 0,
      correctWords: 0,
      timeRemaining: duration,
      wordsCompleted: 0,
    });
    sentenceGenerator.reset();
    generateNewSentence();
  };

  const handleWordComplete = (
    wordIndex: number,
    userInput: string,
    isCorrect: boolean
  ) => {
    // Update the word in current words
    setCurrentWords((prev) =>
      prev.map((word, index) =>
        index === wordIndex
          ? { ...word, isCompleted: true, isCorrect, userInput }
          : word
      )
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalTyped: prev.totalTyped + 1,
      correctWords: prev.correctWords + (isCorrect ? 1 : 0),
      mistakes: prev.mistakes + (isCorrect ? 0 : 1),
      wordsCompleted: prev.wordsCompleted + 1,
    }));

    // Start session on first word if not started
    if (!sessionStarted) {
      startSession();
    }
  };

  const handleNextWord = () => {
    const nextIndex = currentWordIndex + 1;

    if (nextIndex >= currentWords.length) {
      // Generate new sentence when current one is complete
      generateNewSentence();
    } else {
      setCurrentWordIndex(nextIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {category} • {duration}s
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {!sessionStarted ? (
              <Button
                onClick={startSession}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            ) : (
              <>
                {isSessionActive ? (
                  <Button variant="outline" onClick={pauseSession}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : stats.timeRemaining > 0 ? (
                  <Button onClick={startSession}>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>

        {/* Typing Area */}
        <TypingArea
          words={currentWords}
          currentWordIndex={currentWordIndex}
          onWordComplete={handleWordComplete}
          onNextWord={handleNextWord}
          onReset={resetSession}
          timeRemaining={stats.timeRemaining}
        />

        {/* Stats */}
        <StatsPanel stats={stats} isSessionActive={isSessionActive} />
      </div>
    </div>
  );
};

export default PracticeView;
