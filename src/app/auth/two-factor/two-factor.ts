import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthStore } from '../../core/auth/auth-store';
import { AuthErrorCode } from '../../core/mock-api/mock-auth-api';
import { describeAuthError } from '../shared/auth-error-messages';

@Component({
  selector: 'app-two-factor',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <section class="auth-card" aria-labelledby="tfa-title">
      <span class="auth-card__brand">
        <span class="material-symbols-outlined auth-card__brand-icon">ac_unit</span>
        Glacier Analytics
      </span>
      <div>
        <h1 id="tfa-title" class="auth-card__title">雙因子驗證</h1>
        <p class="auth-card__subtitle">請輸入驗證器 App 顯示的 6 位數字代碼以完成登入。</p>
        <p class="auth-card__subtitle" style="margin-top: 0.5rem;">
          <small>測試代碼：<code>123456</code></small>
        </p>
      </div>

      @if (errorCode()) {
        <p class="auth-card__error" role="alert">
          <mat-icon>error_outline</mat-icon>
          {{ errorMessage() }}
        </p>
      }

      <form class="auth-card__form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <mat-form-field appearance="outline" class="auth-card__field">
          <mat-label>驗證代碼</mat-label>
          <input
            matInput
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            formControlName="code"
          />
          @if (form.controls.code.hasError('required') && form.controls.code.touched) {
            <mat-error>請輸入驗證代碼</mat-error>
          } @else if (form.controls.code.hasError('pattern')) {
            <mat-error>請輸入 6 位數字</mat-error>
          }
        </mat-form-field>

        <div class="auth-card__actions">
          <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="loading() || form.invalid"
          >
            @if (loading()) {
              <mat-spinner diameter="20" />
            } @else {
              <span>驗證並登入</span>
            }
          </button>
          <p class="auth-card__footer">
            <a routerLink="/auth/sign-in">← 返回登入</a>
          </p>
        </div>
      </form>
    </section>
  `,
  styleUrl: '../shared/auth-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactor {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  protected readonly loading = signal<boolean>(false);
  protected readonly errorCode = signal<AuthErrorCode | null>(null);

  protected errorMessage(): string {
    const code = this.errorCode();
    return code ? describeAuthError(code) : '';
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorCode.set(null);
    const { code } = this.form.getRawValue();
    const result = await this.auth.verifyTwoFactor(code);
    this.loading.set(false);
    if (!result.ok) {
      this.errorCode.set(result.error);
      return;
    }
    await this.router.navigate(['/app/dashboard']);
  }
}
