import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

/**
 * Stepper 3 — Non-linear with Optional Steps
 * 5 steps (step 3 is optional). Users can jump between steps freely.
 */
@Component({
  selector: 'app-stepper-3',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
    }
    .step-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .step-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .summary dt {
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
    }
    .summary dd {
      margin: 0 0 0.75rem;
    }
  `,
  template: `
    <mat-stepper>
      <!-- Step 1: Basic settings -->
      <mat-step [stepControl]="basicForm" label="基本設定">
        <form [formGroup]="basicForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>應用程式名稱</mat-label>
            <input matInput formControlName="appName" />
            @if (basicForm.controls.appName.hasError('required') &&
                 basicForm.controls.appName.touched) {
              <mat-error>請輸入應用程式名稱</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 2: Advanced settings -->
      <mat-step [stepControl]="advancedForm" label="進階設定">
        <form [formGroup]="advancedForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>API 端點</mat-label>
            <input matInput formControlName="apiEndpoint" />
            @if (advancedForm.controls.apiEndpoint.hasError('required') &&
                 advancedForm.controls.apiEndpoint.touched) {
              <mat-error>請輸入 API 端點</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 3: Notification preferences (optional) -->
      <mat-step [stepControl]="notificationForm" label="通知偏好（選填）" optional>
        <form [formGroup]="notificationForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>通知信箱</mat-label>
            <input matInput formControlName="notifyEmail" type="email" />
          </mat-form-field>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 4: Permissions -->
      <mat-step [stepControl]="permissionForm" label="權限">
        <form [formGroup]="permissionForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>角色名稱</mat-label>
            <input matInput formControlName="role" />
            @if (permissionForm.controls.role.hasError('required') &&
                 permissionForm.controls.role.touched) {
              <mat-error>請輸入角色名稱</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 5: Summary -->
      <mat-step label="摘要">
        <div class="step-content summary">
          <h3>設定摘要</h3>
          <dl>
            <dt>應用程式名稱</dt>
            <dd>{{ basicForm.controls.appName.value || '—' }}</dd>
            <dt>API 端點</dt>
            <dd>{{ advancedForm.controls.apiEndpoint.value || '—' }}</dd>
            <dt>通知信箱</dt>
            <dd>{{ notificationForm.controls.notifyEmail.value || '未設定' }}</dd>
            <dt>角色</dt>
            <dd>{{ permissionForm.controls.role.value || '—' }}</dd>
          </dl>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button type="button">儲存設定</button>
          </div>
        </div>
      </mat-step>
    </mat-stepper>
  `,
})
export class Stepper3Component {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly basicForm = this.fb.group({
    appName: ['', [Validators.required]],
  });

  protected readonly advancedForm = this.fb.group({
    apiEndpoint: ['', [Validators.required]],
  });

  // Optional step — no required validators
  protected readonly notificationForm = this.fb.group({
    notifyEmail: [''],
  });

  protected readonly permissionForm = this.fb.group({
    role: ['', [Validators.required]],
  });
}
