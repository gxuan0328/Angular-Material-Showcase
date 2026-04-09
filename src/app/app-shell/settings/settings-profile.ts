import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MockSettingsApi } from '../../core/mock-api/mock-settings';

interface LocaleOption {
  readonly value: string;
  readonly label: string;
}

interface TimezoneOption {
  readonly value: string;
  readonly label: string;
}

const LOCALE_OPTIONS: readonly LocaleOption[] = [
  { value: 'zh-TW', label: '繁體中文 (台灣)' },
  { value: 'zh-CN', label: '簡體中文 (中國)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
];

const TIMEZONE_OPTIONS: readonly TimezoneOption[] = [
  { value: 'Asia/Taipei', label: '(UTC+8) 台北' },
  { value: 'Asia/Tokyo', label: '(UTC+9) 東京' },
  { value: 'Asia/Shanghai', label: '(UTC+8) 上海' },
  { value: 'America/New_York', label: '(UTC-5) 紐約' },
  { value: 'America/Los_Angeles', label: '(UTC-8) 洛杉磯' },
  { value: 'Europe/London', label: '(UTC+0) 倫敦' },
];

// TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms
@Component({
  selector: 'app-settings-profile',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings-profile.html',
  styleUrl: './settings-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'settings-profile-host' },
})
export class SettingsProfile implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(MockSettingsApi);

  protected readonly localeOptions = LOCALE_OPTIONS;
  protected readonly timezoneOptions = TIMEZONE_OPTIONS;
  protected readonly saving = signal<boolean>(false);
  protected readonly saved = signal<boolean>(false);

  // TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms
  protected readonly form = this.fb.group({
    displayName: ['', [Validators.required]],
    email: [{ value: '', disabled: true }],
    locale: ['zh-TW'],
    timezone: ['Asia/Taipei'],
  });

  ngOnInit(): void {
    const profile = this.api.profile();
    this.form.patchValue({
      displayName: profile.displayName,
      email: profile.email,
      locale: profile.locale,
      timezone: profile.timezone,
    });
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.saved.set(false);

    await this.api.updateProfile({
      displayName: this.form.controls.displayName.value,
      locale: this.form.controls.locale.value,
      timezone: this.form.controls.timezone.value,
    });

    this.saving.set(false);
    this.saved.set(true);
  }
}
