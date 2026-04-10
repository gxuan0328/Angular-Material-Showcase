import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MockUser, MockUsersApi, UserRole, UserStatus } from '../../core/mock-api/mock-users';
import { ConfirmDestructiveDialog } from '../../core/dialogs/confirm-destructive-dialog';

interface AuditEntry {
  readonly action: string;
  readonly at: string;
  readonly actor: string;
}

interface DeviceEntry {
  readonly id: string;
  readonly device: string;
  readonly browser: string;
  readonly location: string;
  readonly lastUsed: string;
  readonly current: boolean;
}

interface PermissionEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly granted: boolean;
}

const AUDIT_BY_ROLE: Readonly<Record<UserRole, readonly string[]>> = {
  owner: ['create_workspace', 'invite_admin', 'update_billing', 'view_dashboard'],
  admin: ['invite_user', 'update_settings', 'review_report', 'view_dashboard'],
  analyst: ['view_dashboard', 'export_report', 'run_query', 'view_dashboard'],
  viewer: ['view_dashboard', 'view_report'],
};

@Component({
  selector: 'app-user-detail',
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'user-detail-host' },
})
export class UserDetail implements OnInit {
  private readonly api = inject(MockUsersApi);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly confirmDialog = inject(ConfirmDestructiveDialog);

  /** `id` comes from the route param via withComponentInputBinding(). */
  readonly id = input<string>('');

  protected readonly busy = signal<boolean>(false);
  protected readonly loaded = signal<boolean>(false);

  protected readonly user = computed<MockUser | undefined>(() => {
    if (!this.loaded()) return undefined;
    const uid = this.id();
    return uid ? this.api.getById(uid) : undefined;
  });

  protected readonly audit = computed<readonly AuditEntry[]>(() => {
    const u = this.user();
    if (!u) return [];
    const actions = AUDIT_BY_ROLE[u.role];
    return actions.map((action, i) => ({
      action,
      at: new Date(Date.now() - i * 36e5).toISOString(),
      actor: u.displayName,
    }));
  });

  protected readonly permissions = computed<readonly PermissionEntry[]>(() => {
    const u = this.user();
    const isOwner = u?.role === 'owner';
    const isAdmin = u?.role === 'owner' || u?.role === 'admin';
    const isAnalyst = isAdmin || u?.role === 'analyst';
    return [
      {
        id: 'view-dashboard',
        label: '檢視儀表板',
        description: '可開啟 /app/dashboard 主要看板',
        granted: true,
      },
      {
        id: 'export-report',
        label: '匯出報表',
        description: '下載 CSV / PDF 報表',
        granted: isAnalyst,
      },
      {
        id: 'manage-users',
        label: '管理使用者',
        description: '新增、編輯、停用使用者帳號',
        granted: isAdmin,
      },
      {
        id: 'edit-billing',
        label: '管理付款',
        description: '更新付款方式與方案',
        granted: isOwner,
      },
      {
        id: 'delete-workspace',
        label: '刪除工作區',
        description: '永久刪除整個 Workspace',
        granted: isOwner,
      },
    ];
  });

  protected readonly devices = computed<readonly DeviceEntry[]>(() => {
    const u = this.user();
    if (!u) return [];
    return [
      {
        id: 'd-1',
        device: 'MacBook Pro 14"',
        browser: 'Chrome 147',
        location: 'Taipei, Taiwan',
        lastUsed: u.lastLoginAt || new Date().toISOString(),
        current: true,
      },
      {
        id: 'd-2',
        device: 'iPhone 16 Pro',
        browser: 'Safari 18',
        location: 'Taipei, Taiwan',
        lastUsed: new Date(Date.now() - 2 * 864e5).toISOString(),
        current: false,
      },
    ];
  });

  async ngOnInit(): Promise<void> {
    await this.api.load();
    this.loaded.set(true);
  }

  protected roleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      owner: '擁有者',
      admin: '管理員',
      analyst: '分析師',
      viewer: '檢視者',
    };
    return labels[role];
  }

  protected statusLabel(status: UserStatus): string {
    const labels: Record<UserStatus, string> = {
      active: '啟用中',
      invited: '已邀請',
      suspended: '已停用',
    };
    return labels[status];
  }

  protected sendMessage(): void {
    const u = this.user();
    if (u) {
      window.open(`mailto:${u.email}?subject=Glacier Analytics — 訊息`, '_blank');
      this.snackBar.open(`已開啟郵件用戶端寄送至 ${u.email}`, '關閉', { duration: 3000 });
    }
  }

  protected async deleteUser(): Promise<void> {
    const current = this.user();
    if (!current) return;
    const ok = await this.confirmDialog.confirm({
      title: '確認刪除使用者',
      message: `確定要永久刪除 ${current.displayName} (${current.email})？此動作無法復原，包含其活動紀錄。`,
      confirmLabel: '永久刪除',
      destructive: true,
    });
    if (!ok) return;
    this.busy.set(true);
    const result = await this.api.remove(current.id);
    this.busy.set(false);
    if (result.ok) {
      await this.router.navigate(['/app/users']);
    }
  }
}
