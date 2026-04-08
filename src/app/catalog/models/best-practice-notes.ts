export interface BestPracticeNotes {
  readonly whenToUse: readonly string[];
  readonly whenNotToUse: readonly string[];
  readonly pitfalls: readonly string[];
  readonly accessibility: readonly string[];
}

export const EMPTY_BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [],
  whenNotToUse: [],
  pitfalls: [],
  accessibility: [],
};
