import { computed, inject, Injectable, signal, Signal } from '@angular/core';

import {
  AuthResult,
  MockAuthApi,
  ResetPasswordInput,
  SignUpInput,
} from '../mock-api/mock-auth-api';

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

export type { AuthErrorCode, AuthResult } from '../mock-api/mock-auth-api';

const STORAGE_KEY = 'auth';
const EIGHT_HOURS_MS = 1000 * 60 * 60 * 8;

function generateMockJwt(user: AuthUser): string {
  const payload = { sub: user.id, email: user.email, iat: Date.now() };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(MockAuthApi);
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

  /** Sign the user in and persist a mock session. Returns a typed Result. */
  async signIn(email: string, password: string): Promise<AuthResult<AuthUser>> {
    const result = await this.api.signIn(email, password);
    if (!result.ok) {
      return result;
    }
    const user: AuthUser = result.value;
    this.persistSession(user);
    return { ok: true, value: user };
  }

  async signUp(input: SignUpInput): Promise<AuthResult<AuthUser>> {
    const result = await this.api.signUp(input);
    if (!result.ok) {
      return result;
    }
    const user: AuthUser = result.value;
    this.persistSession(user);
    return { ok: true, value: user };
  }

  forgotPassword(email: string): Promise<AuthResult<{ sentTo: string }>> {
    return this.api.forgotPassword(email);
  }

  resetPassword(input: ResetPasswordInput): Promise<AuthResult<{ reset: boolean }>> {
    return this.api.resetPassword(input);
  }

  verifyTwoFactor(code: string): Promise<AuthResult<{ verified: boolean }>> {
    return this.api.verifyTwoFactor(code);
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

  private persistSession(user: AuthUser): void {
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
}
