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
  selector: 'app-reset-password',
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
    <section class="auth-card" aria-labelledby="reset-title">
      <span class="auth-card__brand">
        <span class="material-symbols-outlined auth-card__brand-icon">ac_unit</span>
        Glacier Analytics
      </span>
      <div>
        <h1 id="reset-title" class="auth-card__title">重設你的密碼</h1>
        <p class="auth-card__subtitle">請輸入新密碼，並再次確認。完成後即可重新登入。</p>
      </div>

      @if (errorCode()) {
        <p class="auth-card__error" role="alert">
          <mat-icon>error_outline</mat-icon>
          {{ errorMessage() }}
        </p>
      }

      <form class="auth-card__form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <mat-form-field appearance="outline" class="auth-card__field">
          <mat-label>新密碼</mat-label>
          <input matInput type="password" formControlName="newPassword" autocomplete="new-password" />
          @if (form.controls.newPassword.hasError('required') && form.controls.newPassword.touched) {
            <mat-error>請輸入新密碼</mat-error>
          } @else if (form.controls.newPassword.hasError('minlength')) {
            <mat-error>密碼至少 8 個字元</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="auth-card__field">
          <mat-label>確認密碼</mat-label>
          <input matInput type="password" formControlName="confirm" autocomplete="new-password" />
          @if (form.hasError('mismatch') && form.controls.confirm.touched) {
            <mat-error>兩次輸入的密碼不相符</mat-error>
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
              <span>重設密碼</span>
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
export class ResetPassword {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]],
    },
    {
      validators: (group): { mismatch: true } | null => {
        const a = group.get('newPassword')?.value as string | null;
        const b = group.get('confirm')?.value as string | null;
        return a && b && a !== b ? { mismatch: true } : null;
      },
    },
  );

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
    const { newPassword } = this.form.getRawValue();
    // Mock token — a real app would grab this from the query param.
    const result = await this.auth.resetPassword({
      token: 'mock-reset-token-from-email-link',
      newPassword,
    });
    this.loading.set(false);
    if (!result.ok) {
      this.errorCode.set(result.error);
      return;
    }
    await this.router.navigate(['/auth/sign-in']);
  }
}
