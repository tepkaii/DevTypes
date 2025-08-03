import React, { useState } from "react";
import type { SessionDuration, Term } from "./lib/types";
import { devTerms } from "./lib/terms";
import PracticeView from "./TermsComponents/PracticeView";
import HomePage from "./TermsComponents/HomePage";

const App: React.FC = () => {
  const [practiceSession, setPracticeSession] = useState<{
    category: string;
    duration: SessionDuration;
  } | null>(null);

  const handleStart = (category: string, duration: SessionDuration) => {
    setPracticeSession({ category, duration });
  };

  const handleBack = () => {
    setPracticeSession(null);
  };

  const getFilteredTerms = (): Term[] => {
    if (!practiceSession || practiceSession.category === "All") {
      return devTerms;
    }
    return devTerms.filter(
      (term) => term.category === practiceSession.category
    );
  };

  return (
    <div className="App">
      {practiceSession ? (
        <PracticeView
          terms={getFilteredTerms()}
          category={practiceSession.category}
          duration={practiceSession.duration}
          onBack={handleBack}
        />
      ) : (
        <HomePage onStart={handleStart} />
      )}
    </div>
  );
};

export default App;
