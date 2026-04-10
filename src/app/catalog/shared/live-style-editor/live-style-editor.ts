import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Live Style Editor — allows users to write CSS that gets injected into the
 * block preview container in real-time. Provides a split-pane experience with
 * a code textarea and a dynamically updated <style> tag.
 *
 * The component emits the current CSS string via the `styleChange` output so
 * the parent CatalogPage can inject it into the BlockPreview's host element.
 */
@Component({
  selector: 'app-live-style-editor',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './live-style-editor.html',
  styleUrl: './live-style-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'live-style-editor' },
})
export class LiveStyleEditor {
  /** Default CSS snippet shown when the editor opens */
  readonly defaultCss = input<string>('');

  /** Emits the current CSS content whenever the user edits */
  readonly styleChange = output<string>();

  protected readonly editorOpen = signal<boolean>(false);
  protected readonly cssCode = signal<string>('');

  protected readonly lineCount = computed<number>(() => {
    const code = this.cssCode();
    return code ? code.split('\n').length : 1;
  });

  protected toggleEditor(): void {
    const opening = !this.editorOpen();
    this.editorOpen.set(opening);
    if (opening && !this.cssCode()) {
      const template = this.defaultCss() || this.defaultTemplate();
      this.cssCode.set(template);
    }
    if (!opening) {
      // Clear injected styles when closing
      this.styleChange.emit('');
    }
  }

  protected onCodeChange(value: string): void {
    this.cssCode.set(value);
    this.styleChange.emit(value);
  }

  protected resetCode(): void {
    const template = this.defaultCss() || this.defaultTemplate();
    this.cssCode.set(template);
    this.styleChange.emit(template);
  }

  protected clearCode(): void {
    this.cssCode.set('');
    this.styleChange.emit('');
  }

  private defaultTemplate(): string {
    return [
      '/* Custom styles for this block */',
      '/* Edit CSS here to see changes in real-time */',
      '',
      '.block-preview__viewport {',
      '  /* padding: 2rem; */',
      '  /* background: #f0f4ff; */',
      '  /* border-radius: 12px; */',
      '}',
    ].join('\n');
  }
}
