import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Integration, IntegrationCategory, MockSettingsApi } from '../../core/mock-api/mock-settings';

const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  messaging: '訊息通知',
  observability: '可觀測性',
  storage: '儲存空間',
  auth: '身分驗證',
};

@Component({
  selector: 'app-settings-integrations',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './settings-integrations.html',
  styleUrl: './settings-integrations.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'settings-integrations-host' },
})
export class SettingsIntegrations {
  private readonly api = inject(MockSettingsApi);

  protected readonly integrations = this.api.integrations;
  protected readonly toggling = signal<string | null>(null);

  protected categoryLabel(category: IntegrationCategory): string {
    return CATEGORY_LABELS[category];
  }

  protected async toggle(integration: Integration): Promise<void> {
    this.toggling.set(integration.id);
    await this.api.toggleIntegration(integration.id);
    this.toggling.set(null);
  }
}
