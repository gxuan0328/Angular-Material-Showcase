import { Type } from '@angular/core';

export interface BlockVariant {
  readonly id: string;
  readonly label: string;
  readonly registryCategory: string;
  readonly component: Type<unknown>;
  readonly isFree: boolean;
}
