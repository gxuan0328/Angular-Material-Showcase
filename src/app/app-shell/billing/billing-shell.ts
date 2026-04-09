import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { MockBillingApi } from '../../core/mock-api/mock-billing';

interface TabLink {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

const TABS: readonly TabLink[] = [
  { label: '總覽', path: 'overview', icon: 'dashboard' },
  { label: '帳單紀錄', path: 'invoices', icon: 'receipt_long' },
  { label: '用量', path: 'usage', icon: 'data_usage' },
  { label: '方案', path: 'plans', icon: 'workspace_premium' },
];

@Component({
  selector: 'app-billing-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './billing-shell.html',
  styleUrl: './billing-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'billing-shell-host' },
})
export class BillingShell implements OnInit {
  private readonly billingApi = inject(MockBillingApi);

  protected readonly tabs = TABS;

  async ngOnInit(): Promise<void> {
    await this.billingApi.load();
  }
}
