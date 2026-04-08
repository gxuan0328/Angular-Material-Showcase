import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-check-email',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="auth-card" aria-labelledby="check-title">
      <span class="auth-card__brand">
        <span class="material-symbols-outlined auth-card__brand-icon">ac_unit</span>
        Glacier Analytics
      </span>
      <div class="check-email__illustration" aria-hidden="true">
        <mat-icon>mark_email_read</mat-icon>
      </div>
      <div>
        <h1 id="check-title" class="auth-card__title">請檢查你的信箱</h1>
        <p class="auth-card__subtitle">
          我們已寄送一封驗證信給你。請點擊信中連結完成註冊流程，信件可能會出現在「垃圾郵件」資料夾中。
        </p>
      </div>

      <div class="auth-card__actions">
        <button mat-flat-button color="primary" type="button">
          <mat-icon>send</mat-icon>
          <span>重新寄送</span>
        </button>
        <p class="auth-card__footer">
          <a routerLink="/auth/sign-in">← 返回登入</a>
        </p>
      </div>
    </section>
  `,
  styleUrls: ['../shared/auth-card.css', './check-email.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckEmail {}
