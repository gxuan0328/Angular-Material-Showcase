import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface BakedBlock {
  readonly category: string;
  readonly variant: string;
  readonly files: Readonly<Record<string, string>>;
}

@Component({
  selector: 'app-code-viewer',
  imports: [],
  templateUrl: './code-viewer.html',
  styleUrl: './code-viewer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'code-viewer' },
})
export class CodeViewer {
  private readonly http = inject(HttpClient);

  readonly category = input.required<string>();
  readonly variant = input.required<string>();

  protected readonly baked = signal<BakedBlock | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedFile = signal<string>('');

  protected readonly fileNames = computed<readonly string[]>(() => {
    const b = this.baked();
    return b ? Object.keys(b.files) : [];
  });

  protected readonly selectedContent = computed<string>(() => {
    const b = this.baked();
    const name = this.selectedFile();
    if (!b || !name) return '';
    return b.files[name] ?? '';
  });

  constructor() {
    effect(() => {
      const cat = this.category();
      const v = this.variant();
      void this.load(cat, v);
    });
  }

  private async load(category: string, variant: string): Promise<void> {
    this.error.set(null);
    try {
      const url = `assets/block-sources/${category}__${variant}.json`;
      const data = await firstValueFrom(this.http.get<BakedBlock>(url));
      this.baked.set(data);
      const firstFile = Object.keys(data.files)[0] ?? '';
      this.selectedFile.set(firstFile);
    } catch (err) {
      this.baked.set(null);
      this.selectedFile.set('');
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  protected selectFile(name: string): void {
    this.selectedFile.set(name);
  }
}
