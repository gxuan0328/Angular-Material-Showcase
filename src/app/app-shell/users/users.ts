import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { SelectionModel } from '@angular/cdk/collections';

import { MockUser, MockUsersApi, UserRole, UserStatus } from '../../core/mock-api/mock-users';
import { ConfirmDestructiveDialog } from '../../core/dialogs/confirm-destructive-dialog';

interface StatusOption {
  readonly value: UserStatus | 'all';
  readonly label: string;
}
interface RoleOption {
  readonly value: UserRole | 'all';
  readonly label: string;
}

const STATUS_OPTIONS: readonly StatusOption[] = [
  { value: 'all', label: '全部狀態' },
  { value: 'active', label: '啟用中' },
  { value: 'invited', label: '已邀請' },
  { value: 'suspended', label: '已停用' },
];

const ROLE_OPTIONS: readonly RoleOption[] = [
  { value: 'all', label: '全部角色' },
  { value: 'owner', label: '擁有者' },
  { value: 'admin', label: '管理員' },
  { value: 'analyst', label: '分析師' },
  { value: 'viewer', label: '檢視者' },
];

@Component({
  selector: 'app-users',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'users-host' },
})
export class Users implements OnInit {
  protected readonly api = inject(MockUsersApi);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  private readonly confirmDialog = inject(ConfirmDestructiveDialog);

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly roleOptions = ROLE_OPTIONS;
  protected readonly displayedColumns: readonly string[] = [
    'select',
    'displayName',
    'role',
    'status',
    'tags',
    'lastLoginAt',
    'actions',
  ];

  protected readonly filterForm = this.fb.group({
    search: [''],
    status: ['all' as UserStatus | 'all'],
    role: ['all' as UserRole | 'all'],
  });

  protected readonly selection = new SelectionModel<MockUser>(true, []);
  protected readonly busy = signal<boolean>(false);
  protected readonly stats = this.api.stats;

  protected readonly dataSource = computed<MatTableDataSource<MockUser>>(() => {
    const ds = new MatTableDataSource(this.api.filteredUsers().slice());
    return ds;
  });

  protected readonly hasSelection = computed<boolean>(() => this.selection.hasValue());

  constructor() {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.api.setFilters({
          search: value.search ?? '',
          status: (value.status ?? 'all') as UserStatus | 'all',
          role: (value.role ?? 'all') as UserRole | 'all',
        });
        this.selection.clear();
      });
  }

  async ngOnInit(): Promise<void> {
    await this.api.load();
  }

  protected toggleAll(): void {
    const rows = this.api.filteredUsers();
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...rows);
  }

  protected isAllSelected(): boolean {
    const rows = this.api.filteredUsers();
    return rows.length > 0 && rows.every(u => this.selection.isSelected(u));
  }

  protected roleLabel(role: UserRole): string {
    return ROLE_OPTIONS.find(r => r.value === role)?.label ?? role;
  }

  protected statusLabel(status: UserStatus): string {
    return STATUS_OPTIONS.find(s => s.value === status)?.label ?? status;
  }

  protected rowTrack(_: number, user: MockUser): string {
    return user.id;
  }

  protected resetFilters(): void {
    this.filterForm.setValue({ search: '', status: 'all', role: 'all' });
  }

  protected sortChange(sort: Sort): void {
    // Sorting is applied on a snapshot; for a full app we would push sort
    // state into the API so pagination stays consistent. MockUsersApi stays
    // unsorted on purpose — the list view below re-sorts locally.
    const ds = this.dataSource();
    const data = ds.data.slice();
    if (!sort.active || sort.direction === '') {
      ds.data = data;
      return;
    }
    const dir = sort.direction === 'asc' ? 1 : -1;
    data.sort((a, b) => {
      const va = a[sort.active as keyof MockUser];
      const vb = b[sort.active as keyof MockUser];
      if (typeof va === 'string' && typeof vb === 'string') {
        return va.localeCompare(vb) * dir;
      }
      return 0;
    });
    ds.data = data;
  }

  protected async bulkRemove(): Promise<void> {
    const ids = this.selection.selected.map(u => u.id);
    if (ids.length === 0) return;
    const ok = await this.confirmDialog.confirm({
      title: '確認停用使用者',
      message: `即將停用 ${ids.length} 位使用者，其帳號將無法登入。此動作可在「已停用」分頁還原。`,
      confirmLabel: '停用',
      destructive: true,
      icon: 'person_off',
    });
    if (!ok) return;
    this.busy.set(true);
    await Promise.all(ids.map(id => this.api.update(id, { status: 'suspended' })));
    this.busy.set(false);
    this.selection.clear();
  }

  protected async deleteRow(user: MockUser): Promise<void> {
    const ok = await this.confirmDialog.confirm({
      title: '確認刪除使用者',
      message: `確定要永久刪除 ${user.displayName} (${user.email})？此動作無法復原。`,
      confirmLabel: '刪除',
      destructive: true,
    });
    if (!ok) return;
    this.busy.set(true);
    await this.api.remove(user.id);
    this.busy.set(false);
    this.selection.deselect(user);
  }

  protected viewDetail(user: MockUser): void {
    this.router.navigate(['/app/users', user.id]);
  }
}
