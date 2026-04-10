import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { GuideChapter, GuideExercise } from '../models/guide-chapter';
import { getNextGuideEntry, getPreviousGuideEntry } from './guide-registry';

@Component({
  selector: 'app-guide-page',
  imports: [RouterLink, MatIconModule, MatChipsModule],
  templateUrl: './guide-page.html',
  styleUrl: './guide-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'guide-page' },
})
export class GuidePage {
  private readonly document = inject(DOCUMENT);
  readonly chapter = input.required<GuideChapter>();

  protected readonly previousEntry = computed(() => getPreviousGuideEntry(this.chapter().id));
  protected readonly nextEntry = computed(() => getNextGuideEntry(this.chapter().id));

  protected readonly expandedExercises = new Set<string>();

  protected readonly categoryLabel = computed(() => {
    const cat = this.chapter().category;
    switch (cat) {
      case 'fundamentals': return '基礎概念';
      case 'intermediate': return '進階應用';
      case 'advanced': return '高階實踐';
      case 'framework-core': return '框架核心';
    }
  });

  protected toggleExercise(id: string): void {
    if (this.expandedExercises.has(id)) {
      this.expandedExercises.delete(id);
    } else {
      this.expandedExercises.add(id);
    }
  }

  protected isExerciseExpanded(id: string): boolean {
    return this.expandedExercises.has(id);
  }

  protected scrollTo(sectionId: string): void {
    const el = this.document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  protected tipIcon(type: string): string {
    switch (type) {
      case 'tip': return 'lightbulb';
      case 'warning': return 'warning';
      case 'best-practice': return 'verified';
      case 'dotnet-comparison': return 'compare_arrows';
      default: return 'info';
    }
  }

  protected tipLabel(type: string): string {
    switch (type) {
      case 'tip': return '提示';
      case 'warning': return '注意';
      case 'best-practice': return '最佳實踐';
      case 'dotnet-comparison': return '.NET 對照';
      default: return '資訊';
    }
  }
}
