import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthResult } from './mock-auth-api';

export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';
export type UserStatus = 'active' | 'invited' | 'suspended';

export interface MockUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly avatar: string;
  readonly lastLoginAt: string;
  readonly createdAt: string;
  readonly tags: readonly string[];
}

export interface UserFilters {
  readonly search: string;
  readonly status: UserStatus | 'all';
  readonly role: UserRole | 'all';
}

export interface CreateUserInput {
  readonly email: string;
  readonly displayName: string;
  readonly role: UserRole;
  readonly tags?: readonly string[];
}

interface UsersDocument {
  readonly users: readonly MockUser[];
}

const DEFAULT_FILTERS: UserFilters = {
  search: '',
  status: 'all',
  role: 'all',
};

function matches(user: MockUser, filters: UserFilters): boolean {
  if (filters.status !== 'all' && user.status !== filters.status) return false;
  if (filters.role !== 'all' && user.role !== filters.role) return false;
  const q = filters.search.trim().toLowerCase();
  if (!q) return true;
  return (
    user.displayName.toLowerCase().includes(q) ||
    user.email.toLowerCase().includes(q) ||
    user.tags.some(t => t.toLowerCase().includes(q))
  );
}

/**
 * In-memory users API backed by `assets/mock-data/users.json`. Exposes
 * filterable / searchable signals so the `/app/users` list view can react
 * declaratively. Mutations (create / update / remove / bulkRemove) return
 * Result-pattern values and keep the local store consistent.
 */
@Injectable({ providedIn: 'root' })
export class MockUsersApi {
  private readonly http = inject(HttpClient);

  private readonly _users = signal<readonly MockUser[]>([]);
  private readonly _loaded = signal<boolean>(false);
  private readonly _filters = signal<UserFilters>(DEFAULT_FILTERS);

  readonly users: Signal<readonly MockUser[]> = this._users.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();
  readonly filters: Signal<UserFilters> = this._filters.asReadonly();

  readonly filteredUsers = computed<readonly MockUser[]>(() => {
    const f = this._filters();
    return this._users().filter(u => matches(u, f));
  });

  readonly stats = computed(() => {
    const all = this._users();
    return {
      total: all.length,
      active: all.filter(u => u.status === 'active').length,
      invited: all.filter(u => u.status === 'invited').length,
      suspended: all.filter(u => u.status === 'suspended').length,
    };
  });

  async load(): Promise<void> {
    if (this._loaded()) return;
    const doc = await firstValueFrom(this.http.get<UsersDocument>('assets/mock-data/users.json'));
    this._users.set(doc.users);
    this._loaded.set(true);
  }

  setFilters(next: Partial<UserFilters>): void {
    this._filters.update(current => ({ ...current, ...next }));
  }

  resetFilters(): void {
    this._filters.set(DEFAULT_FILTERS);
  }

  getById(id: string): MockUser | undefined {
    return this._users().find(u => u.id === id);
  }

  async create(input: CreateUserInput): Promise<AuthResult<MockUser>> {
    await delay();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) {
      return { ok: false, error: 'InvalidCredentials' };
    }
    if (this._users().some(u => u.email.toLowerCase() === input.email.toLowerCase())) {
      return { ok: false, error: 'EmailAlreadyInUse' };
    }
    const user: MockUser = {
      id: newId(),
      email: input.email,
      displayName: input.displayName.trim(),
      role: input.role,
      status: 'invited',
      avatar:
        input.displayName
          .trim()
          .split(/\s+/)
          .map(p => p[0]?.toUpperCase() ?? '')
          .join('')
          .slice(0, 2) || input.email.slice(0, 2).toUpperCase(),
      lastLoginAt: '',
      createdAt: new Date().toISOString(),
      tags: input.tags ?? [],
    };
    this._users.update(list => [user, ...list]);
    return { ok: true, value: user };
  }

  async update(id: string, patch: Partial<Omit<MockUser, 'id'>>): Promise<AuthResult<MockUser>> {
    await delay();
    const target = this.getById(id);
    if (!target) return { ok: false, error: 'UserNotFound' };
    const next: MockUser = { ...target, ...patch, id: target.id };
    this._users.update(list => list.map(u => (u.id === id ? next : u)));
    return { ok: true, value: next };
  }

  async remove(id: string): Promise<AuthResult<{ id: string }>> {
    await delay();
    const exists = this.getById(id);
    if (!exists) return { ok: false, error: 'UserNotFound' };
    this._users.update(list => list.filter(u => u.id !== id));
    return { ok: true, value: { id } };
  }

  async bulkRemove(ids: readonly string[]): Promise<AuthResult<{ removed: number }>> {
    await delay();
    const idSet = new Set(ids);
    const before = this._users().length;
    this._users.update(list => list.filter(u => !idSet.has(u.id)));
    const removed = before - this._users().length;
    return { ok: true, value: { removed } };
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `u-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `u-${Math.random().toString(36).slice(2, 10)}`;
}

function delay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 220));
}
