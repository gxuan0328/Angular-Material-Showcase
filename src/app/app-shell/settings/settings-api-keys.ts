import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MockSettingsApi } from '../../core/mock-api/mock-settings';

interface ScopeOption {
  readonly value: string;
  readonly label: string;
}

const SCOPE_OPTIONS: readonly ScopeOption[] = [
  { value: 'read', label: '讀取' },
  { value: 'write', label: '寫入' },
  { value: 'admin', label: '管理' },
  { value: 'export', label: '匯出' },
  { value: 'webhook', label: 'Webhook' },
];

// TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms
@Component({
  selector: 'app-settings-api-keys',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings-api-keys.html',
  styleUrl: './settings-api-keys.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'settings-api-keys-host' },
})
export class SettingsApiKeys {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(MockSettingsApi);

  protected readonly apiKeys = this.api.apiKeys;
  protected readonly scopeOptions = SCOPE_OPTIONS;
  protected readonly showCreateForm = signal<boolean>(false);
  protected readonly creating = signal<boolean>(false);
  protected readonly deleting = signal<string | null>(null);

  // TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms
  protected readonly createForm = this.fb.group({
    label: ['', [Validators.required]],
    scopeRead: [true],
    scopeWrite: [false],
    scopeAdmin: [false],
    scopeExport: [false],
    scopeWebhook: [false],
  });

  protected openCreateForm(): void {
    this.showCreateForm.set(true);
    this.createForm.reset({ label: '', scopeRead: true, scopeWrite: false, scopeAdmin: false, scopeExport: false, scopeWebhook: false });
  }

  protected cancelCreate(): void {
    this.showCreateForm.set(false);
  }

  protected async submitCreate(): Promise<void> {
    if (this.createForm.invalid) return;
    this.creating.set(true);

    const scopes: string[] = [];
    if (this.createForm.controls.scopeRead.value) scopes.push('read');
    if (this.createForm.controls.scopeWrite.value) scopes.push('write');
    if (this.createForm.controls.scopeAdmin.value) scopes.push('admin');
    if (this.createForm.controls.scopeExport.value) scopes.push('export');
    if (this.createForm.controls.scopeWebhook.value) scopes.push('webhook');

    await this.api.createApiKey(this.createForm.controls.label.value, scopes);
    this.creating.set(false);
    this.showCreateForm.set(false);
  }

  protected async deleteKey(id: string): Promise<void> {
    this.deleting.set(id);
    await this.api.deleteApiKey(id);
    this.deleting.set(null);
  }
}
