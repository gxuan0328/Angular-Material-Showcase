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
    await store.signIn('alice@example.com', 'secret-password');
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.email).toBe('alice@example.com');
    expect(store.user()?.id).toBeTruthy();
  });

  it('signIn rejects passwords shorter than 6 characters', async () => {
    const store = create();
    await expectAsync(store.signIn('alice@example.com', 'short')).toBeRejectedWithError(
      /at least 6/i,
    );
    expect(store.isAuthenticated()).toBe(false);
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
