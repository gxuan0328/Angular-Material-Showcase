import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MockSettingsApi, TwoFactorState } from '../../core/mock-api/mock-settings';

interface MockSession {
  readonly id: string;
  readonly device: string;
  readonly ip: string;
  readonly lastActive: string;
  readonly current: boolean;
}

const MOCK_SESSIONS: readonly MockSession[] = [
  { id: 's-001', device: 'Chrome · macOS', ip: '203.69.112.45', lastActive: '2026-04-09T10:30:00Z', current: true },
  { id: 's-002', device: 'Firefox · Windows', ip: '61.219.36.78', lastActive: '2026-04-08T15:20:00Z', current: false },
  { id: 's-003', device: 'Safari · iPhone', ip: '114.34.88.12', lastActive: '2026-04-07T08:45:00Z', current: false },
];

// TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms
@Component({
  selector: 'app-settings-security',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings-security.html',
  styleUrl: './settings-security.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'settings-security-host' },
})
export class SettingsSecurity {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(MockSettingsApi);

  protected readonly twoFactor = this.api.twoFactor;
  protected readonly sessions = MOCK_SESSIONS;
  protected readonly showEnableForm = signal<boolean>(false);
  protected readonly showDisableConfirm = signal<boolean>(false);
  protected readonly loading = signal<boolean>(false);

  protected readonly statusLabel = computed((): string => {
    const state: TwoFactorState = this.twoFactor();
    if (!state.enabled) return '未啟用';
    return state.method === 'totp' ? '已啟用 (TOTP)' : '已啟用 (SMS)';
  });

  // TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms
  protected readonly enableForm = this.fb.group({
    method: ['totp' as 'totp' | 'sms', [Validators.required]],
  });

  protected openEnableForm(): void {
    this.showEnableForm.set(true);
    this.showDisableConfirm.set(false);
  }

  protected cancelEnable(): void {
    this.showEnableForm.set(false);
  }

  protected async confirmEnable(): Promise<void> {
    this.loading.set(true);
    await this.api.enableTwoFactor(this.enableForm.controls.method.value);
    this.loading.set(false);
    this.showEnableForm.set(false);
  }

  protected openDisableConfirm(): void {
    this.showDisableConfirm.set(true);
    this.showEnableForm.set(false);
  }

  protected cancelDisable(): void {
    this.showDisableConfirm.set(false);
  }

  protected async confirmDisable(): Promise<void> {
    this.loading.set(true);
    await this.api.disableTwoFactor();
    this.loading.set(false);
    this.showDisableConfirm.set(false);
  }
}
