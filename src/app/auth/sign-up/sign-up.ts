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
  selector: 'app-sign-up',
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
    <section class="auth-card" aria-labelledby="sign-up-title">
      <span class="auth-card__brand">
        <span class="material-symbols-outlined auth-card__brand-icon">ac_unit</span>
        Glacier Analytics
      </span>
      <div>
        <h1 id="sign-up-title" class="auth-card__title">建立你的帳號</h1>
        <p class="auth-card__subtitle">立即註冊並啟用 14 天免費試用 · 無須信用卡</p>
      </div>

      @if (errorCode()) {
        <p class="auth-card__error" role="alert">
          <mat-icon>error_outline</mat-icon>
          {{ errorMessage() }}
        </p>
      }

      <form class="auth-card__form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <mat-form-field appearance="outline" class="auth-card__field">
          <mat-label>姓名</mat-label>
          <input matInput type="text" formControlName="displayName" autocomplete="name" />
          @if (form.controls.displayName.hasError('required') && form.controls.displayName.touched) {
            <mat-error>請輸入姓名</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="auth-card__field">
          <mat-label>工作信箱</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" />
          @if (form.controls.email.hasError('required') && form.controls.email.touched) {
            <mat-error>請輸入電子郵件</mat-error>
          } @else if (form.controls.email.hasError('email')) {
            <mat-error>電子郵件格式不正確</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="auth-card__field">
          <mat-label>設定密碼</mat-label>
          <input
            matInput
            type="password"
            formControlName="password"
            autocomplete="new-password"
          />
          <mat-hint>至少 8 個字元，建議混合英數與符號</mat-hint>
          @if (form.controls.password.hasError('required') && form.controls.password.touched) {
            <mat-error>請輸入密碼</mat-error>
          } @else if (form.controls.password.hasError('minlength')) {
            <mat-error>密碼至少 8 個字元</mat-error>
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
              <span>建立帳號</span>
            }
          </button>
          <p class="auth-card__footer">
            <span>已經有帳號？</span>
            <a routerLink="/auth/sign-in">改為登入</a>
          </p>
        </div>
      </form>
    </section>
  `,
  styleUrl: '../shared/auth-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
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
    const { email, password, displayName } = this.form.getRawValue();
    const result = await this.auth.signUp({ email, password, displayName });
    this.loading.set(false);
    if (!result.ok) {
      this.errorCode.set(result.error);
      return;
    }
    await this.router.navigate(['/app/dashboard']);
  }
}
