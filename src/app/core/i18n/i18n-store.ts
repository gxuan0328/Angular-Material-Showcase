import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Locale = 'zh-TW';

@Injectable({ providedIn: 'root' })
export class I18nStore {
  private readonly http = inject(HttpClient);

  private readonly _locale = signal<Locale>('zh-TW');
  private readonly _dict = signal<Readonly<Record<string, string>>>({});
  private readonly _loaded = signal<boolean>(false);

  readonly locale: Signal<Locale> = this._locale.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();
  readonly entryCount = computed(() => Object.keys(this._dict()).length);

  async load(): Promise<void> {
    if (this._loaded()) return;
    const dict = await firstValueFrom(
      this.http.get<Record<string, string>>(`assets/i18n/${this._locale()}.json`),
    );
    this._dict.set(dict);
    this._loaded.set(true);
  }

  t(key: string, params?: Readonly<Record<string, string | number>>): string {
    const raw = this._dict()[key] ?? key;
    if (!params) return raw;
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
      raw,
    );
  }
}
