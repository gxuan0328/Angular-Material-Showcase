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

import { StatusMonitoring1Component } from '../../blocks/status-monitoring/status-monitoring-1/status-monitoring-1.component';
import { StatusMonitoring2Component } from '../../blocks/status-monitoring/status-monitoring-2/status-monitoring-2.component';
import { StatusMonitoring3Component } from '../../blocks/status-monitoring/status-monitoring-3/status-monitoring-3.component';
import { StatusMonitoring4Component } from '../../blocks/status-monitoring/status-monitoring-4/status-monitoring-4.component';
import { StatusMonitoring5Component } from '../../blocks/status-monitoring/status-monitoring-5/status-monitoring-5.component';
import { StatusMonitoring6Component } from '../../blocks/status-monitoring/status-monitoring-6/status-monitoring-6.component';
import { StatusMonitoring7Component } from '../../blocks/status-monitoring/status-monitoring-7/status-monitoring-7.component';
import { StatusMonitoring8Component } from '../../blocks/status-monitoring/status-monitoring-8/status-monitoring-8.component';
import { StatusMonitoring9Component } from '../../blocks/status-monitoring/status-monitoring-9/status-monitoring-9.component';
import { StatusMonitoring10Component } from '../../blocks/status-monitoring/status-monitoring-10/status-monitoring-10.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'status-monitoring-1',
    label: 'Status Monitoring 01 — 整體狀態一覽',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring1Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-2',
    label: 'Status Monitoring 02 — 含 uptime tracker',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring2Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-3',
    label: 'Status Monitoring 03 — 區域服務健康卡',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring3Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-4',
    label: 'Status Monitoring 04 — 事件時間線',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring4Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-5',
    label: 'Status Monitoring 05 — 多環境狀態',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring5Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-6',
    label: 'Status Monitoring 06 — 含訊息橫幅',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring6Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-7',
    label: 'Status Monitoring 07 — 資料流狀態卡',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring7Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-8',
    label: 'Status Monitoring 08 — 含當前事件',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring8Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-9',
    label: 'Status Monitoring 09 — 多指標監控面板',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring9Component,
    isFree: false,
  },
  {
    id: 'status-monitoring-10',
    label: 'Status Monitoring 10 — 含修復中提醒',
    registryCategory: 'status-monitoring',
    component: StatusMonitoring10Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [],
  cssProperties: [
    {
      name: '--mat-sys-tertiary-container',
      type: 'color',
      default: '#e0e0ff',
      required: false,
      description: 'Healthy 狀態背景色',
    },
    {
      name: '--mat-sys-error-container',
      type: 'color',
      default: '#ffdad6',
      required: false,
      description: 'Outage / degraded 狀態背景色',
    },
    {
      name: '--mat-sys-surface-container',
      type: 'color',
      default: '#f1eff4',
      required: false,
      description: '狀態卡背景色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '系統狀態頁 / 公開 status page',
    'DevOps / SRE 觀察儀表板',
    '多環境（prod / staging / qa）或多區域健康概覽',
    '事件與維護時間線呈現',
  ],
  whenNotToUse: [
    '僅呈現單一服務狀態 — 改用簡單 Badge + 文字',
    '主要目的是效能趨勢 — 使用 Line Chart',
    '需要鑽取到事件詳情 — 改用搭配 Tables 的列表',
  ],
  pitfalls: [
    '綠色表示正常卻搭配深底讓色盲使用者無法辨識',
    '狀態過舊未標記「最後更新時間」',
    '多個指標擠在一張卡造成視覺混亂',
    '事件時間線順序錯誤或缺少時區資訊',
  ],
  accessibility: [
    '狀態以文字（Operational / Degraded / Outage）搭配色塊呈現',
    '為時間線每個節點提供 `aria-label` 包含狀態變化',
    'tracker 使用 `role="img"` 並附帶文字描述',
    '提供自動刷新時顯示可關閉的通知',
  ],
};

const META: CatalogBlockMeta = {
  id: 'status-monitoring',
  title: 'Status Monitoring',
  category: 'application',
  subcategory: 'Components',
  summary:
    '系統狀態與健康儀表集合，包含 uptime tracker、服務健康卡、事件時間線、多環境監控等 10 種組合。',
  tags: ['status', 'monitoring', 'uptime', 'health'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['kpi-cards', 'chart-compositions', 'banners', 'empty-states'],
};

@Component({
  selector: 'app-status-monitoring-catalog-page',
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
export class StatusMonitoringCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
