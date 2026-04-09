import { ChangeDetectionStrategy, Component, inject, Injectable } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

export interface ConfirmDestructiveOptions {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly destructive?: boolean;
  readonly icon?: string;
}

type DialogData = ConfirmDestructiveOptions;

/**
 * Lightweight confirmation dialog used for destructive actions throughout
 * the Live Showcase (delete user, remove team member, revoke API key).
 * Wraps `MatDialog` so callers stay decoupled from the Angular Material
 * dialog component and can `await` a boolean result.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmDestructiveDialog {
  private readonly dialog = inject(MatDialog);

  async confirm(options: ConfirmDestructiveOptions): Promise<boolean> {
    const ref = this.dialog.open<ConfirmDestructiveDialogContent, DialogData, boolean>(
      ConfirmDestructiveDialogContent,
      {
        data: options,
        maxWidth: 480,
        disableClose: false,
        autoFocus: 'first-tabbable',
        restoreFocus: true,
        panelClass: 'confirm-destructive-dialog',
      },
    );
    const result = await firstValueFrom(ref.afterClosed());
    return result === true;
  }
}

@Component({
  selector: 'app-confirm-destructive-dialog-content',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog" role="alertdialog" aria-labelledby="confirm-dialog-title">
      <div
        class="confirm-dialog__icon"
        [class.confirm-dialog__icon--destructive]="data.destructive"
      >
        <mat-icon>{{ data.icon ?? (data.destructive ? 'warning' : 'help') }}</mat-icon>
      </div>
      <h2 id="confirm-dialog-title" class="confirm-dialog__title" mat-dialog-title>
        {{ data.title }}
      </h2>
      <mat-dialog-content class="confirm-dialog__content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="confirm-dialog__actions">
        <button mat-button type="button" (click)="cancel()">
          {{ data.cancelLabel ?? '取消' }}
        </button>
        <button
          mat-flat-button
          type="button"
          [color]="data.destructive ? 'warn' : 'primary'"
          (click)="confirm()"
        >
          {{ data.confirmLabel ?? (data.destructive ? '確認刪除' : '確認') }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .confirm-dialog {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.25rem;
    }
    .confirm-dialog__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 9999px;
      background: var(--mat-sys-primary-container, #d7e3ff);
      color: var(--mat-sys-on-primary-container, #00458f);
      margin-bottom: 0.25rem;
    }
    .confirm-dialog__icon--destructive {
      background: var(--mat-sys-error-container, #ffdad6);
      color: var(--mat-sys-on-error-container, #93000a);
    }
    .confirm-dialog__title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .confirm-dialog__content p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant, #44474e);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .confirm-dialog__actions {
      margin-top: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDestructiveDialogContent {
  protected readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly ref =
    inject<MatDialogRef<ConfirmDestructiveDialogContent, boolean>>(MatDialogRef);

  protected confirm(): void {
    this.ref.close(true);
  }

  protected cancel(): void {
    this.ref.close(false);
  }
}
