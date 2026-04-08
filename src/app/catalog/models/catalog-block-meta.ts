import { BlockDisplayCategory } from '../../core/layout/models';

import { ApiDocumentation } from './api-documentation';
import { BestPracticeNotes } from './best-practice-notes';
import { BlockVariant } from './block-variant';

export type CatalogStatus = 'shipped' | 'coming-soon';

export interface CatalogBlockMeta {
  readonly id: string;
  readonly title: string;
  readonly category: BlockDisplayCategory;
  readonly subcategory: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly status: CatalogStatus;
  readonly variants: readonly BlockVariant[];
  readonly api: ApiDocumentation;
  readonly bestPractices: BestPracticeNotes;
  readonly relatedBlockIds: readonly string[];
}
