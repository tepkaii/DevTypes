import { commonWords } from "./terms";
import type { Term, WordItem } from "./types";

export class SentenceGenerator {
  private devTerms: Term[];
  private usedTerms: Set<string> = new Set();

  constructor(devTerms: Term[]) {
    this.devTerms = devTerms;
  }

  generateSentence(): WordItem[] {
    const sentenceLength = Math.floor(Math.random() * 8) + 8; // 8-15 words
    const devTermCount = Math.floor(Math.random() * 3) + 2; // 2-4 dev terms per sentence
    const words: WordItem[] = [];

    // Pick random dev terms for this sentence
    const availableTerms = this.devTerms.filter(
      (term) => !this.usedTerms.has(term.term)
    );

    // If we've used all terms, reset the used set
    if (availableTerms.length < devTermCount) {
      this.usedTerms.clear();
    }

    const selectedTerms = this.getRandomItems(
      availableTerms.length > 0 ? availableTerms : this.devTerms,
      devTermCount
    );

    // Mark selected terms as used
    selectedTerms.forEach((term) => this.usedTerms.add(term.term));

    // Generate positions for dev terms
    const devTermPositions = new Set<number>();
    while (devTermPositions.size < devTermCount) {
      devTermPositions.add(Math.floor(Math.random() * sentenceLength));
    }

    let termIndex = 0;
    for (let i = 0; i < sentenceLength; i++) {
      if (devTermPositions.has(i) && termIndex < selectedTerms.length) {
        // Add a dev term
        const term = selectedTerms[termIndex];
        words.push({
          id: `${Date.now()}-${i}`,
          word: term.term,
          isDevTerm: true,
          definition: term.definition,
          isCompleted: false,
          isCorrect: false,
          userInput: "",
        });
        termIndex++;
      } else {
        // Add a common word
        const commonWord = this.getRandomItem(commonWords);
        words.push({
          id: `${Date.now()}-${i}`,
          word: commonWord,
          isDevTerm: false,
          isCompleted: false,
          isCorrect: false,
          userInput: "",
        });
      }
    }

    return words;
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  reset() {
    this.usedTerms.clear();
  }
}
