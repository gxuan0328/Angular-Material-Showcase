import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { MockSettingsApi, PreferenceGroup, PreferenceOption } from '../../core/mock-api/mock-settings';

@Component({
  selector: 'app-settings-preferences',
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './settings-preferences.html',
  styleUrl: './settings-preferences.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'settings-preferences-host' },
})
export class SettingsPreferences {
  private readonly api = inject(MockSettingsApi);

  protected readonly preferences = this.api.preferences;

  protected async onToggle(group: PreferenceGroup, option: PreferenceOption, enabled: boolean): Promise<void> {
    await this.api.updatePreference(group.id, option.id, enabled);
  }
}
