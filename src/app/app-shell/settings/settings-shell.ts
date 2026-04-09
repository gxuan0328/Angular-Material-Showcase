import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { MockSettingsApi } from '../../core/mock-api/mock-settings';

interface SettingsTab {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

const TABS: readonly SettingsTab[] = [
  { label: '個人檔案', path: 'profile', icon: 'person' },
  { label: '安全設定', path: 'security', icon: 'security' },
  { label: 'API 金鑰', path: 'api-keys', icon: 'vpn_key' },
  { label: '整合', path: 'integrations', icon: 'extension' },
  { label: '偏好設定', path: 'preferences', icon: 'tune' },
];

@Component({
  selector: 'app-settings-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './settings-shell.html',
  styleUrl: './settings-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'settings-shell-host' },
})
export class SettingsShell implements OnInit {
  private readonly api = inject(MockSettingsApi);

  protected readonly tabs = TABS;

  async ngOnInit(): Promise<void> {
    await this.api.load();
  }
}
