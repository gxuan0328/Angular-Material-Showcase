import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { AuthStore } from './auth-store';

describe('AuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), AuthStore],
    });
  });

  function create(): AuthStore {
    return TestBed.inject(AuthStore);
  }

  it('starts unauthenticated with null user', () => {
    const store = create();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
  });

  it('signIn with a valid email and a >=6 char password authenticates', async () => {
    const store = create();
    const result = await store.signIn('alice@example.com', 'secret-password');
    expect(result.ok).toBe(true);
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.email).toBe('alice@example.com');
    expect(store.user()?.id).toBeTruthy();
  });

  it('signIn returns InvalidCredentials for passwords shorter than 6 characters', async () => {
    const store = create();
    const result = await store.signIn('alice@example.com', 'short');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('InvalidCredentials');
    }
    expect(store.isAuthenticated()).toBe(false);
  });

  it('signIn returns AccountLocked for locked@ emails', async () => {
    const store = create();
    const result = await store.signIn('locked@example.com', 'secret-password');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('AccountLocked');
    }
    expect(store.isAuthenticated()).toBe(false);
  });

  it('signUp with a valid email and strong password authenticates', async () => {
    const store = create();
    const result = await store.signUp({
      email: 'new@example.com',
      password: 'super-secret-123',
      displayName: 'New User',
    });
    expect(result.ok).toBe(true);
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.displayName).toBe('New User');
  });

  it('signUp returns WeakPassword for short passwords', async () => {
    const store = create();
    const result = await store.signUp({ email: 'new@example.com', password: 'short' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('WeakPassword');
    }
    expect(store.isAuthenticated()).toBe(false);
  });

  it('forgotPassword succeeds for known emails', async () => {
    const store = create();
    const result = await store.forgotPassword('alice@example.com');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.sentTo).toBe('alice@example.com');
    }
  });

  it('forgotPassword returns UserNotFound for unknown@ emails', async () => {
    const store = create();
    const result = await store.forgotPassword('unknown@example.com');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('UserNotFound');
    }
  });

  it('verifyTwoFactor accepts 123456', async () => {
    const store = create();
    const result = await store.verifyTwoFactor('123456');
    expect(result.ok).toBe(true);
  });

  it('verifyTwoFactor rejects wrong codes with InvalidCode', async () => {
    const store = create();
    const result = await store.verifyTwoFactor('000001');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('InvalidCode');
    }
  });

  it('signOut clears state and localStorage', async () => {
    const store = create();
    await store.signIn('bob@example.com', 'secret-password');
    store.signOut();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
    expect(localStorage.getItem('auth')).toBeNull();
  });

  it('restore() rehydrates a non-expired session from localStorage', () => {
    const future = Date.now() + 60_000;
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: { id: 'u1', email: 'carol@example.com', displayName: 'Carol' },
        token: 'mock-token',
        expiresAt: future,
      }),
    );
    const store = create();
    store.restore();
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.email).toBe('carol@example.com');
  });

  it('restore() ignores an expired session', () => {
    const past = Date.now() - 60_000;
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: { id: 'u1', email: 'dave@example.com', displayName: 'Dave' },
        token: 'mock-token',
        expiresAt: past,
      }),
    );
    const store = create();
    store.restore();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('restore() ignores corrupt JSON', () => {
    localStorage.setItem('auth', '{not-json');
    const store = create();
    expect(() => store.restore()).not.toThrow();
    expect(store.isAuthenticated()).toBe(false);
  });
});
