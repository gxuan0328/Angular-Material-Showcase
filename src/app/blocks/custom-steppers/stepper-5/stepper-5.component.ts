import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

/**
 * Cross-field validator: confirmPassword must match password.
 */
function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (!password || !confirm) return null;
    return password.value === confirm.value ? null : { passwordMismatch: true };
  };
}

/**
 * Stepper 5 — With Form Validation
 * 3 linear steps with ReactiveForm validation, mat-error messages,
 * and a summary + submit button on the final step.
 */
@Component({
  selector: 'app-stepper-5',
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
    .password-mismatch {
      color: var(--mat-sys-error);
      font-size: 0.75rem;
      margin-top: -0.5rem;
    }
  `,
  template: `
    <mat-stepper [linear]="isLinear">
      <!-- Step 1: Account info -->
      <mat-step [stepControl]="accountForm" label="帳號資料">
        <form [formGroup]="accountForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>姓名</mat-label>
            <input matInput formControlName="name" autocomplete="name" />
            @if (accountForm.controls.name.hasError('required') &&
                 accountForm.controls.name.touched) {
              <mat-error>請輸入姓名</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>電子郵件</mat-label>
            <input matInput formControlName="email" type="email" autocomplete="email" />
            @if (accountForm.controls.email.hasError('required') &&
                 accountForm.controls.email.touched) {
              <mat-error>請輸入電子郵件</mat-error>
            } @else if (accountForm.controls.email.hasError('email')) {
              <mat-error>電子郵件格式不正確</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 2: Password -->
      <mat-step [stepControl]="passwordForm" label="設定密碼">
        <form [formGroup]="passwordForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>密碼</mat-label>
            <input matInput formControlName="password" type="password" autocomplete="new-password" />
            @if (passwordForm.controls.password.hasError('required') &&
                 passwordForm.controls.password.touched) {
              <mat-error>請輸入密碼</mat-error>
            } @else if (passwordForm.controls.password.hasError('minlength')) {
              <mat-error>密碼至少需要 8 個字元</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>確認密碼</mat-label>
            <input matInput formControlName="confirmPassword" type="password" autocomplete="new-password" />
            @if (passwordForm.controls.confirmPassword.hasError('required') &&
                 passwordForm.controls.confirmPassword.touched) {
              <mat-error>請再次輸入密碼</mat-error>
            }
          </mat-form-field>

          @if (passwordForm.hasError('passwordMismatch') &&
               passwordForm.controls.confirmPassword.touched) {
            <p class="password-mismatch">兩次輸入的密碼不一致</p>
          }

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 3: Summary + submit -->
      <mat-step label="確認送出">
        <div class="step-content summary">
          <h3>帳號摘要</h3>
          <dl>
            <dt>姓名</dt>
            <dd>{{ accountForm.controls.name.value || '—' }}</dd>
            <dt>電子郵件</dt>
            <dd>{{ accountForm.controls.email.value || '—' }}</dd>
            <dt>密碼</dt>
            <dd>********</dd>
          </dl>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button type="button" (click)="submit()">建立帳號</button>
          </div>
        </div>
      </mat-step>
    </mat-stepper>
  `,
})
export class Stepper5Component {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly isLinear = true;

  protected readonly accountForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly passwordForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordMatchValidator()] },
  );

  protected submit(): void {
    if (this.accountForm.invalid || this.passwordForm.invalid) {
      return;
    }
    // Submit logic would go here
    console.log('Account created', {
      name: this.accountForm.controls.name.value,
      email: this.accountForm.controls.email.value,
    });
  }
}
