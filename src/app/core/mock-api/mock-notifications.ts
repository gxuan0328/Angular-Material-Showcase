import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type NotificationType = 'system' | 'billing' | 'invite';
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';
export type NotificationFilter = 'all' | 'unread' | 'system' | 'billing';

export interface MockNotification {
  readonly id: string;
  readonly type: NotificationType;
  readonly severity: NotificationSeverity;
  readonly title: string;
  readonly message: string;
  readonly read: boolean;
  readonly timestamp: string;
  readonly href: string;
}

interface NotificationsDocument {
  readonly notifications: readonly MockNotification[];
}

/**
 * In-memory notifications API backed by
 * `assets/mock-data/notifications.json`. Exposes a filter signal so the
 * `/app/notifications` feed view can react declaratively, plus
 * markAsRead() and markAllAsRead() mutations.
 */
@Injectable({ providedIn: 'root' })
export class MockNotificationsApi {
  private readonly http = inject(HttpClient);

  private readonly _notifications = signal<readonly MockNotification[]>([]);
  private readonly _loaded = signal<boolean>(false);
  private readonly _filter = signal<NotificationFilter>('all');

  readonly notifications: Signal<readonly MockNotification[]> = this._notifications.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();
  readonly filter: Signal<NotificationFilter> = this._filter.asReadonly();

  readonly unreadCount = computed<number>(() => this._notifications().filter(n => !n.read).length);

  readonly filtered = computed<readonly MockNotification[]>(() => {
    const current = this._filter();
    const all = this._notifications();
    switch (current) {
      case 'unread':
        return all.filter(n => !n.read);
      case 'system':
        return all.filter(n => n.type === 'system');
      case 'billing':
        return all.filter(n => n.type === 'billing');
      default:
        return all;
    }
  });

  async load(): Promise<void> {
    if (this._loaded()) return;
    const doc = await firstValueFrom(
      this.http.get<NotificationsDocument>('assets/mock-data/notifications.json'),
    );
    this._notifications.set(doc.notifications);
    this._loaded.set(true);
  }

  setFilter(next: NotificationFilter): void {
    this._filter.set(next);
  }

  markAsRead(id: string): void {
    this._notifications.update(list => list.map(n => (n.id === id ? { ...n, read: true } : n)));
  }

  markAllAsRead(): void {
    this._notifications.update(list => list.map(n => ({ ...n, read: true })));
  }
}
