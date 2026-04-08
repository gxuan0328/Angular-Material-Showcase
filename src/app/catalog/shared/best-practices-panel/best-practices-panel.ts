import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BestPracticeNotes } from '../../models/best-practice-notes';

interface PracticeSection {
  readonly title: string;
  readonly icon: '✓' | '✗' | '⚠' | '♿';
  readonly items: readonly string[];
  readonly tone: 'good' | 'bad' | 'warn' | 'info';
}

@Component({
  selector: 'app-best-practices-panel',
  imports: [],
  templateUrl: './best-practices-panel.html',
  styleUrl: './best-practices-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'best-practices-panel' },
})
export class BestPracticesPanel {
  readonly notes = input.required<BestPracticeNotes>();

  protected readonly sections = computed<readonly PracticeSection[]>(() => {
    const n = this.notes();
    return [
      { title: '何時使用', icon: '✓', tone: 'good', items: n.whenToUse },
      { title: '何時不該使用', icon: '✗', tone: 'bad', items: n.whenNotToUse },
      { title: '常見陷阱', icon: '⚠', tone: 'warn', items: n.pitfalls },
      { title: '無障礙重點', icon: '♿', tone: 'info', items: n.accessibility },
    ];
  });

  protected readonly hasAny = computed(() => this.sections().some(s => s.items.length > 0));
}
