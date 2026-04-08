import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthStore } from '../../core/auth/auth-store';
import { AuthErrorCode } from '../../core/mock-api/mock-auth-api';
import { describeAuthError } from '../shared/auth-error-messages';

@Component({
  selector: 'app-forgot-password',
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
    <section class="auth-card" aria-labelledby="forgot-title">
      <span class="auth-card__brand">
        <span class="material-symbols-outlined auth-card__brand-icon">ac_unit</span>
        Glacier Analytics
      </span>
      <div>
        <h1 id="forgot-title" class="auth-card__title">忘記密碼了嗎？</h1>
        <p class="auth-card__subtitle">
          輸入註冊時的電子郵件，我們會寄送重設密碼的連結給你。
        </p>
      </div>

      @if (errorCode()) {
        <p class="auth-card__error" role="alert">
          <mat-icon>error_outline</mat-icon>
          {{ errorMessage() }}
        </p>
      }

      @if (success()) {
        <p class="auth-card__success" role="status">
          <mat-icon>mark_email_read</mat-icon>
          已將重設連結寄送至 <strong>{{ sentTo() }}</strong>
        </p>
      }

      <form class="auth-card__form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <mat-form-field appearance="outline" class="auth-card__field">
          <mat-label>電子郵件</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" />
          @if (form.controls.email.hasError('required') && form.controls.email.touched) {
            <mat-error>請輸入電子郵件</mat-error>
          } @else if (form.controls.email.hasError('email')) {
            <mat-error>電子郵件格式不正確</mat-error>
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
              <span>寄送重設連結</span>
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
export class ForgotPassword {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthStore);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly loading = signal<boolean>(false);
  protected readonly errorCode = signal<AuthErrorCode | null>(null);
  protected readonly success = signal<boolean>(false);
  protected readonly sentTo = signal<string>('');

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
    this.success.set(false);
    const { email } = this.form.getRawValue();
    const result = await this.auth.forgotPassword(email);
    this.loading.set(false);
    if (!result.ok) {
      this.errorCode.set(result.error);
      return;
    }
    this.success.set(true);
    this.sentTo.set(result.value.sentTo);
  }
}
