import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ApiTable } from '../shared/api-table/api-table';
import { BestPracticesPanel } from '../shared/best-practices-panel/best-practices-panel';
import { BlockPreview } from '../shared/block-preview/block-preview';
import { CatalogPage } from '../shared/catalog-page/catalog-page';
import { CodeViewer } from '../shared/code-viewer/code-viewer';
import { VariantSelector } from '../shared/variant-selector/variant-selector';
import { ApiDocumentation } from '../models/api-documentation';
import { BestPracticeNotes } from '../models/best-practice-notes';
import { BlockVariant } from '../models/block-variant';
import { CatalogBlockMeta } from '../models/catalog-block-meta';

import { FileUpload1Component } from '../../blocks/file-upload/file-upload-1/file-upload-1.component';
import { FileUpload2DropzoneComponent } from '../../blocks/file-upload/file-upload-2/file-upload-2.component';
import { FileUpload3DropzoneComponent } from '../../blocks/file-upload/file-upload-3/file-upload-3.component';
import { FileUpload4DropzoneComponent } from '../../blocks/file-upload/file-upload-4/file-upload-4.component';
import { FileUpload5DropzoneComponent } from '../../blocks/file-upload/file-upload-5/file-upload-5.component';
import { FileUpload6DropzoneComponent } from '../../blocks/file-upload/file-upload-6/file-upload-6.component';
import { FileUpload7DropzoneComponent } from '../../blocks/file-upload/file-upload-7/file-upload-7.component';

const VARIANTS: readonly BlockVariant[] = [
  { id: 'file-upload-1', label: 'File Upload 01 — 基本上傳按鈕', registryCategory: 'file-upload', component: FileUpload1Component, isFree: false },
  { id: 'file-upload-2', label: 'File Upload 02 — Dropzone 拖放區', registryCategory: 'file-upload', component: FileUpload2DropzoneComponent, isFree: false },
  { id: 'file-upload-3', label: 'File Upload 03 — 多檔拖放上傳', registryCategory: 'file-upload', component: FileUpload3DropzoneComponent, isFree: false },
  { id: 'file-upload-4', label: 'File Upload 04 — 含預覽的拖放區', registryCategory: 'file-upload', component: FileUpload4DropzoneComponent, isFree: false },
  { id: 'file-upload-5', label: 'File Upload 05 — 大尺寸拖放區', registryCategory: 'file-upload', component: FileUpload5DropzoneComponent, isFree: false },
  { id: 'file-upload-6', label: 'File Upload 06 — 內嵌卡片拖放區', registryCategory: 'file-upload', component: FileUpload6DropzoneComponent, isFree: false },
  { id: 'file-upload-7', label: 'File Upload 07 — 緊湊型拖放區', registryCategory: 'file-upload', component: FileUpload7DropzoneComponent, isFree: false },
];

const API: ApiDocumentation = {
  inputs: [
    {
      name: 'multiple',
      type: 'boolean',
      default: 'true',
      required: false,
      description: '允許多檔上傳',
    },
    {
      name: 'accept',
      type: 'string',
      default: '*',
      required: false,
      description: '可接受的檔案類型（如 `image/*`、`.pdf`）',
    },
    {
      name: 'maxSize',
      type: 'number',
      default: null,
      required: false,
      description: '單檔大小上限（bytes）',
    },
  ],
  outputs: [
    {
      name: 'filesAdded',
      type: 'EventEmitter<File[]>',
      default: null,
      required: false,
      description: '使用者選擇或拖放新檔案時觸發',
    },
  ],
  slots: [],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '大頭照、文件、匯入 CSV 等需要使用者上傳檔案的場景',
    '拖放區變體在桌面環境提升互動效率',
    '多檔批次上傳時使用進度條回饋每個檔案狀態',
    '檔案預覽讓使用者確認選對檔案後再提交',
  ],
  whenNotToUse: [
    '僅需檔案下載的場景 — 使用按鈕或連結',
    '不支援拖放的舊瀏覽器環境 — 保留 input fallback',
  ],
  pitfalls: [
    '缺少檔案大小/類型驗證，後端收到非法檔案',
    '大檔案沒有進度顯示，使用者以為失敗重複上傳',
    '拖放區視覺回饋不明確，使用者不知道可否放開',
    '沒有錯誤狀態呈現（檔案過大、類型錯誤）',
  ],
  accessibility: [
    '拖放區必須有對應的 file input 作為 fallback 供鍵盤使用者',
    '提供清晰的 `aria-label` 描述可接受的檔案類型與大小上限',
    '上傳進度透過 `role="progressbar"` 或 `aria-valuenow` 宣告',
    '錯誤狀態使用 `role="alert"` 立即通知',
  ],
};

const META: CatalogBlockMeta = {
  id: 'file-upload',
  title: 'File Upload',
  category: 'application',
  subcategory: 'Forms',
  summary:
    '檔案上傳集合，涵蓋基本按鈕、拖放區、多檔批次、預覽、進度條等常見上傳情境，使用 @ngx-dropzone 底層驅動。',
  tags: ['file-upload', 'dropzone', 'form', 'input'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['form-layouts', 'account-user-management'],
};

@Component({
  selector: 'app-file-upload-catalog-page',
  imports: [CatalogPage, BlockPreview, VariantSelector, CodeViewer, ApiTable, BestPracticesPanel],
  template: `
    <app-catalog-page [meta]="meta">
      <div slot="preview">
        <app-variant-selector
          [variants]="meta.variants"
          [selectedId]="selectedId()"
          (selectionChange)="onVariantChange($event)"
        />
        <app-block-preview [variant]="currentVariant()" />
      </div>
      <app-code-viewer
        slot="code"
        [category]="currentVariant().registryCategory"
        [variant]="currentVariant().id"
      />
      <app-api-table slot="api" [api]="meta.api" />
      <app-best-practices-panel slot="best-practices" [notes]="meta.bestPractices" />
    </app-catalog-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
