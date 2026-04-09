import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import {
  MockNotificationsApi,
  NotificationFilter,
  NotificationSeverity,
  NotificationType,
} from '../../core/mock-api/mock-notifications';

interface FilterChipOption {
  readonly id: NotificationFilter;
  readonly label: string;
  readonly icon: string;
}

const FILTER_OPTIONS: readonly FilterChipOption[] = [
  { id: 'all', label: '全部', icon: 'inbox' },
  { id: 'unread', label: '未讀', icon: 'mark_email_unread' },
  { id: 'system', label: '系統', icon: 'settings' },
  { id: 'billing', label: '帳單', icon: 'receipt_long' },
];

@Component({
  selector: 'app-notifications',
  imports: [
    DatePipe,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="notifications">
      <header class="notifications__header">
        <div>
          <p class="notifications__eyebrow">管理後台 · 通知</p>
          <h1 class="notifications__title">通知中心</h1>
          <p class="notifications__subtitle">
            共 {{ api.notifications().length }} 則通知 · 未讀 {{ api.unreadCount() }}
          </p>
        </div>
        <button
          mat-stroked-button
          type="button"
          [disabled]="api.unreadCount() === 0"
          (click)="markAllAsRead()"
        >
          <mat-icon>done_all</mat-icon>
          <span>全部標記為已讀</span>
        </button>
      </header>

      <mat-chip-listbox
        class="notifications__filters"
        aria-label="篩選通知類型"
        [value]="api.filter()"
        (change)="onFilterChange($event.value)"
      >
        @for (option of filterOptions; track option.id) {
          <mat-chip-option [value]="option.id" [selected]="api.filter() === option.id">
            <mat-icon class="notifications__filter-icon">{{ option.icon }}</mat-icon>
            {{ option.label }}
            @if (option.id === 'unread' && api.unreadCount() > 0) {
              <span class="notifications__filter-count">{{ api.unreadCount() }}</span>
            }
          </mat-chip-option>
        }
      </mat-chip-listbox>

      <mat-card appearance="outlined" class="notifications__card">
        @if (visible().length === 0) {
          <div class="notifications__empty" role="status">
            <mat-icon>inbox</mat-icon>
            <p>沒有符合條件的通知</p>
          </div>
        } @else {
          <ul class="notifications__list" role="list">
            @for (item of visible(); track item.id; let last = $last) {
              <li class="notifications__item-row">
                <button
                  type="button"
                  class="notifications__item"
                  [class.notifications__item--unread]="!item.read"
                  [attr.data-severity]="item.severity"
                  (click)="api.markAsRead(item.id)"
                >
                  <div
                    class="notifications__item-icon notifications__item-icon--{{ item.severity }}"
                  >
                    <mat-icon>{{ iconFor(item.type, item.severity) }}</mat-icon>
                  </div>
                  <div class="notifications__item-body">
                    <div class="notifications__item-title">
                      <strong>{{ item.title }}</strong>
                      @if (!item.read) {
                        <span class="notifications__dot" aria-label="未讀"></span>
                      }
                    </div>
                    <p class="notifications__item-message">{{ item.message }}</p>
                    <p class="notifications__item-meta">
                      {{ typeLabel(item.type) }} · {{ item.timestamp | date: 'MM/dd HH:mm' }}
                    </p>
                  </div>
                </button>
              </li>
              @if (!last) {
                <mat-divider />
              }
            }
          </ul>
        }
      </mat-card>
    </div>
  `,
  styleUrl: './notifications.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'notifications-host' },
})
export class Notifications implements OnInit {
  protected readonly api = inject(MockNotificationsApi);
  protected readonly filterOptions = FILTER_OPTIONS;

  protected readonly visible = computed(() => this.api.filtered());

  async ngOnInit(): Promise<void> {
    await this.api.load();
  }

  protected onFilterChange(next: NotificationFilter | null): void {
    if (next) this.api.setFilter(next);
  }

  protected markAllAsRead(): void {
    this.api.markAllAsRead();
  }

  protected typeLabel(type: NotificationType): string {
    switch (type) {
      case 'system':
        return '系統';
      case 'billing':
        return '帳單';
      case 'invite':
        return '邀請';
    }
  }

  protected iconFor(type: NotificationType, severity: NotificationSeverity): string {
    if (severity === 'error') return 'error';
    if (severity === 'warning') return 'warning';
    if (severity === 'success') return 'check_circle';
    switch (type) {
      case 'billing':
        return 'receipt_long';
      case 'invite':
        return 'person_add';
      default:
        return 'notifications';
    }
  }
}
