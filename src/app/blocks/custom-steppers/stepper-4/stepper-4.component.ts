import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Stepper 4 — Custom Icons
 * 3 steps with custom matStepperIcon overrides: edit, security, check_circle.
 */
@Component({
  selector: 'app-stepper-4',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
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
    <mat-stepper linear>
      <!-- Custom icon overrides -->
      <ng-template matStepperIcon="edit">
        <mat-icon>edit</mat-icon>
      </ng-template>
      <ng-template matStepperIcon="number">
        <mat-icon>edit</mat-icon>
      </ng-template>
      <ng-template matStepperIcon="done">
        <mat-icon>check_circle</mat-icon>
      </ng-template>

      <!-- Step 1: Basic info -->
      <mat-step [stepControl]="basicForm" label="基本資料">
        <form [formGroup]="basicForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>姓名</mat-label>
            <input matInput formControlName="name" autocomplete="name" />
            @if (basicForm.controls.name.hasError('required') &&
                 basicForm.controls.name.touched) {
              <mat-error>請輸入姓名</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>電子郵件</mat-label>
            <input matInput formControlName="email" type="email" autocomplete="email" />
            @if (basicForm.controls.email.hasError('required') &&
                 basicForm.controls.email.touched) {
              <mat-error>請輸入電子郵件</mat-error>
            } @else if (basicForm.controls.email.hasError('email')) {
              <mat-error>電子郵件格式不正確</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 2: Security verification -->
      <mat-step [stepControl]="securityForm" label="安全驗證">
        <form [formGroup]="securityForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>驗證碼</mat-label>
            <input matInput formControlName="verificationCode" />
            @if (securityForm.controls.verificationCode.hasError('required') &&
                 securityForm.controls.verificationCode.touched) {
              <mat-error>請輸入驗證碼</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 3: Done -->
      <mat-step label="完成">
        <div class="step-content summary">
          <h3>設定完成</h3>
          <dl>
            <dt>姓名</dt>
            <dd>{{ basicForm.controls.name.value || '—' }}</dd>
            <dt>電子郵件</dt>
            <dd>{{ basicForm.controls.email.value || '—' }}</dd>
            <dt>驗證碼</dt>
            <dd>{{ securityForm.controls.verificationCode.value || '—' }}</dd>
          </dl>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button type="button">完成</button>
          </div>
        </div>
      </mat-step>
    </mat-stepper>
  `,
})
export class Stepper4Component {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly basicForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly securityForm = this.fb.group({
    verificationCode: ['', [Validators.required]],
  });
}
