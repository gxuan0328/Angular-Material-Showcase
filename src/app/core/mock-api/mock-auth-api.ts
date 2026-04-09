import { Injectable } from '@angular/core';

/**
 * Typed error codes exposed by the mock auth API. Callers inspect the string
 * literal and map it to UI messaging — no stringly-typed error parsing.
 */
export type AuthErrorCode =
  | 'InvalidCredentials'
  | 'AccountLocked'
  | 'EmailAlreadyInUse'
  | 'UserNotFound'
  | 'NotFound'
  | 'InvalidToken'
  | 'InvalidCode'
  | 'WeakPassword'
  | 'TooManyAttempts'
  | 'Unknown';

export interface MockAuthUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}

/**
 * Result pattern used throughout the mock auth API. Callers discriminate via
 * `result.ok` and never try/catch on the auth flow.
 */
export type AuthResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: AuthErrorCode };

export interface SignUpInput {
  readonly email: string;
  readonly password: string;
  readonly displayName?: string;
}

export interface ResetPasswordInput {
  readonly token: string;
  readonly newPassword: string;
}

/** Tunable latency so loading spinners remain visible. */
const MIN_LATENCY_MS = 220;

/**
 * In-memory auth API that mirrors a real backend's failure surface. The
 * showcase needs realistic error paths so every auth screen has a reason to
 * render inline errors and loading states.
 *
 * Deterministic failure triggers:
 * - `locked@...`        → AccountLocked
 * - `network@...`       → Unknown (simulates outage)
 * - `exists@...`        → EmailAlreadyInUse (sign-up only)
 * - `unknown@...`       → UserNotFound (forgot/reset)
 * - password length < 6 → InvalidCredentials / WeakPassword
 * - 2FA code != '123456' → InvalidCode
 */
@Injectable({ providedIn: 'root' })
export class MockAuthApi {
  async signIn(email: string, password: string): Promise<AuthResult<MockAuthUser>> {
    await delay();
    if (email.startsWith('network@')) {
      return { ok: false, error: 'Unknown' };
    }
    if (email.startsWith('locked@')) {
      return { ok: false, error: 'AccountLocked' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'InvalidCredentials' };
    }
    return { ok: true, value: createUser(email) };
  }

  async signUp(input: SignUpInput): Promise<AuthResult<MockAuthUser>> {
    await delay();
    if (input.email.startsWith('network@')) {
      return { ok: false, error: 'Unknown' };
    }
    if (input.email.startsWith('exists@')) {
      return { ok: false, error: 'EmailAlreadyInUse' };
    }
    if (input.password.length < 8) {
      return { ok: false, error: 'WeakPassword' };
    }
    return {
      ok: true,
      value: createUser(input.email, input.displayName),
    };
  }

  async forgotPassword(email: string): Promise<AuthResult<{ sentTo: string }>> {
    await delay();
    if (email.startsWith('network@')) {
      return { ok: false, error: 'Unknown' };
    }
    if (email.startsWith('unknown@')) {
      return { ok: false, error: 'UserNotFound' };
    }
    return { ok: true, value: { sentTo: email } };
  }

  async resetPassword(input: ResetPasswordInput): Promise<AuthResult<{ reset: boolean }>> {
    await delay();
    if (input.token.length < 8) {
      return { ok: false, error: 'InvalidToken' };
    }
    if (input.newPassword.length < 8) {
      return { ok: false, error: 'WeakPassword' };
    }
    return { ok: true, value: { reset: true } };
  }

  async verifyTwoFactor(code: string): Promise<AuthResult<{ verified: boolean }>> {
    await delay();
    if (code === '000000') {
      return { ok: false, error: 'TooManyAttempts' };
    }
    if (code !== '123456') {
      return { ok: false, error: 'InvalidCode' };
    }
    return { ok: true, value: { verified: true } };
  }
}

function createUser(email: string, displayName?: string): MockAuthUser {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `u_${Math.random().toString(36).slice(2, 11)}`;
  return {
    id,
    email,
    displayName: displayName?.trim() || (email.split('@')[0] ?? email),
  };
}

function delay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, MIN_LATENCY_MS));
}
