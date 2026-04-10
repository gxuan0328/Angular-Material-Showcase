import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CatalogBlockMeta } from '../../models/catalog-block-meta';
import { getNextEntry, getPreviousEntry } from '../catalog-registry';
import { LiveStyleEditor } from '../live-style-editor/live-style-editor';

@Component({
  selector: 'app-catalog-page',
  imports: [RouterLink, LiveStyleEditor],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'catalog-page' },
})
export class CatalogPage implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  readonly meta = input.required<CatalogBlockMeta>();

  protected readonly previousEntry = computed(() => getPreviousEntry(this.meta().id));
  protected readonly nextEntry = computed(() => getNextEntry(this.meta().id));
  protected readonly hasVariants = computed(() => this.meta().variants.length > 0);

  /** CSS injected by the live style editor */
  protected readonly liveStyleCss = signal<string>('');

  /** Dynamic <style> element for live CSS injection */
  private styleElement: HTMLStyleElement | null = null;

  constructor() {
    effect(() => {
      const css = this.liveStyleCss();
      if (css) {
        if (!this.styleElement) {
          this.styleElement = this.document.createElement('style');
          this.styleElement.setAttribute('data-live-editor', 'true');
          this.document.head.appendChild(this.styleElement);
        }
        this.styleElement.textContent = css;
      } else if (this.styleElement) {
        this.styleElement.textContent = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }

  protected onLiveStyleChange(css: string): void {
    this.liveStyleCss.set(css);
  }
}
