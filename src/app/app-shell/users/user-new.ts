import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { CreateUserInput, MockUsersApi, UserRole } from '../../core/mock-api/mock-users';
import { AuthErrorCode } from '../../core/mock-api/mock-auth-api';
import { describeAuthError } from '../../auth/shared/auth-error-messages';

interface RoleOption {
  readonly value: UserRole;
  readonly label: string;
  readonly description: string;
}

const ROLE_OPTIONS: readonly RoleOption[] = [
  { value: 'viewer', label: '檢視者', description: '唯讀存取所有看板與報表' },
  { value: 'analyst', label: '分析師', description: '可執行查詢、匯出報表、自訂看板' },
  { value: 'admin', label: '管理員', description: '可管理使用者、整合與帳務以外的所有設定' },
  { value: 'owner', label: '擁有者', description: '完整控制工作區，包含付款與刪除權限' },
];

// TODO(m5-signal-forms-migration): Angular 20.3 does not yet support Signal
// Forms (spec §2 / §13 require v21+). This stepper uses ReactiveForms with
// the expectation that the migration will happen during M5 as documented in
// docs/plans/2026-04-09-m3-users-forms-plan.md §D2.
@Component({
  selector: 'app-user-new',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './user-new.html',
  styleUrl: './user-new.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'user-new-host' },
})
export class UserNew {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(MockUsersApi);
  private readonly router = inject(Router);

  protected readonly roleOptions = ROLE_OPTIONS;
  protected readonly loading = signal<boolean>(false);
  protected readonly errorCode = signal<AuthErrorCode | null>(null);

  protected readonly basicsForm = this.fb.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    tagPreset: ['engineering' as string],
  });

  protected readonly roleForm = this.fb.group({
    role: ['analyst' as UserRole, [Validators.required]],
  });

  protected readonly preferencesForm = this.fb.group({
    emailNotifications: [true],
    inAppNotifications: [true],
    weeklyDigest: [false],
  });

  protected errorMessage(): string {
    const code = this.errorCode();
    return code ? describeAuthError(code) : '';
  }

  protected selectedRoleDescription(): string {
    const role = this.roleForm.controls.role.value;
    return ROLE_OPTIONS.find(r => r.value === role)?.description ?? '';
  }

  protected async submit(): Promise<void> {
    if (this.basicsForm.invalid || this.roleForm.invalid) return;
    this.loading.set(true);
    this.errorCode.set(null);
    const input: CreateUserInput = {
      displayName: this.basicsForm.controls.displayName.value,
      email: this.basicsForm.controls.email.value,
      role: this.roleForm.controls.role.value,
      tags: [this.basicsForm.controls.tagPreset.value],
    };
    const result = await this.api.create(input);
    this.loading.set(false);
    if (!result.ok) {
      this.errorCode.set(result.error);
      return;
    }
    await this.router.navigate(['/app/users', result.value.id]);
  }
}
