import { computed, Injectable, signal, Signal } from '@angular/core';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}

export interface AuthState {
  readonly user: AuthUser | null;
  readonly token: string | null;
  readonly expiresAt: number | null;
}

const STORAGE_KEY = 'auth';
const EIGHT_HOURS_MS = 1000 * 60 * 60 * 8;

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `u_${Math.random().toString(36).slice(2, 11)}`;
}

function generateMockJwt(user: AuthUser): string {
  const payload = { sub: user.id, email: user.email, iat: Date.now() };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _state = signal<AuthState>({
    user: null,
    token: null,
    expiresAt: null,
  });

  readonly state: Signal<AuthState> = this._state.asReadonly();
  readonly user = computed<AuthUser | null>(() => this._state().user);
  readonly isAuthenticated = computed<boolean>(() => {
    const s = this._state();
    return !!s.token && (s.expiresAt ?? 0) > Date.now();
  });

  async signIn(email: string, password: string): Promise<void> {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const user: AuthUser = {
      id: createId(),
      email,
      displayName: email.split('@')[0] ?? email,
    };
    const next: AuthState = {
      user,
      token: generateMockJwt(user),
      expiresAt: Date.now() + EIGHT_HOURS_MS,
    };
    this._state.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }

  signOut(): void {
    this._state.set({ user: null, token: null, expiresAt: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  restore(): void {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    let parsed: AuthState;
    try {
      parsed = JSON.parse(raw) as AuthState;
    } catch {
      return;
    }
    if (!parsed?.token || !parsed.user || (parsed.expiresAt ?? 0) <= Date.now()) {
      return;
    }
    this._state.set(parsed);
  }
}
