/** Metadata for a single guide chapter/lesson */
export interface GuideChapter {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly category: GuideCategory;
  readonly tags: readonly string[];
  readonly estimatedMinutes: number;
  readonly sections: readonly GuideSection[];
}

export type GuideCategory = 'fundamentals' | 'intermediate' | 'advanced';

/** A section within a chapter containing explanatory text and code examples */
export interface GuideSection {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly codeExamples?: readonly GuideCodeExample[];
  readonly tips?: readonly GuideTip[];
}

/** An inline code example with language, filename, and annotated source */
export interface GuideCodeExample {
  readonly filename: string;
  readonly language: 'typescript' | 'html' | 'css' | 'bash';
  readonly code: string;
  readonly annotation?: string;
}

/** A tip, warning, or best practice callout */
export interface GuideTip {
  readonly type: 'tip' | 'warning' | 'best-practice' | 'dotnet-comparison';
  readonly content: string;
}
