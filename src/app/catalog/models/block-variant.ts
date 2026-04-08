import { Type } from '@angular/core';

export interface BlockVariant {
  readonly id: string;
  readonly label: string;
  readonly registryCategory: string;
  readonly component: Type<unknown>;
  readonly isFree: boolean;
  /**
   * Optional inputs forwarded to `ngComponentOutlet` when the component
   * is mounted in the Live Preview zone. Required for vendor blocks that
   * declare `input.required<T>()` — without these, the component throws
   * NG0950 at render time.
   */
  readonly demoInputs?: Readonly<Record<string, unknown>>;
}
