import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { MockAuthApi } from './mock-auth-api';

describe('MockAuthApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), MockAuthApi],
    });
  });

  function api(): MockAuthApi {
    return TestBed.inject(MockAuthApi);
  }

  describe('signIn()', () => {
    it('returns ok=true for valid credentials', async () => {
      const result = await api().signIn('alice@example.com', 'secret-password');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.email).toBe('alice@example.com');
        expect(result.value.displayName).toBe('alice');
        expect(result.value.id).toBeTruthy();
      }
    });

    it('returns InvalidCredentials for short password', async () => {
      const result = await api().signIn('alice@example.com', 'abc');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('InvalidCredentials');
      }
    });

    it('returns AccountLocked for locked@ prefix', async () => {
      const result = await api().signIn('locked@example.com', 'secret-password');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('AccountLocked');
      }
    });

    it('returns Unknown for network@ prefix', async () => {
      const result = await api().signIn('network@example.com', 'secret-password');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('Unknown');
      }
    });
  });

  describe('signUp()', () => {
    it('returns ok=true for valid input', async () => {
      const result = await api().signUp({
        email: 'new@example.com',
        password: 'super-secret-123',
        displayName: 'Newbie',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.displayName).toBe('Newbie');
      }
    });

    it('returns EmailAlreadyInUse for exists@ prefix', async () => {
      const result = await api().signUp({
        email: 'exists@example.com',
        password: 'super-secret-123',
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('EmailAlreadyInUse');
      }
    });

    it('returns WeakPassword for <8 char password', async () => {
      const result = await api().signUp({ email: 'new@example.com', password: 'short' });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('WeakPassword');
      }
    });
  });

  describe('forgotPassword()', () => {
    it('returns ok=true with the destination email', async () => {
      const result = await api().forgotPassword('alice@example.com');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.sentTo).toBe('alice@example.com');
      }
    });

    it('returns UserNotFound for unknown@ prefix', async () => {
      const result = await api().forgotPassword('unknown@example.com');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('UserNotFound');
      }
    });
  });

  describe('resetPassword()', () => {
    it('returns ok=true for valid token and strong password', async () => {
      const result = await api().resetPassword({
        token: 'reset-token-xyz',
        newPassword: 'brand-new-123',
      });
      expect(result.ok).toBe(true);
    });

    it('returns InvalidToken for short token', async () => {
      const result = await api().resetPassword({
        token: 'short',
        newPassword: 'brand-new-123',
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('InvalidToken');
      }
    });

    it('returns WeakPassword for short new password', async () => {
      const result = await api().resetPassword({
        token: 'reset-token-xyz',
        newPassword: 'nope',
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('WeakPassword');
      }
    });
  });

  describe('verifyTwoFactor()', () => {
    it('returns ok=true for code 123456', async () => {
      const result = await api().verifyTwoFactor('123456');
      expect(result.ok).toBe(true);
    });

    it('returns InvalidCode for wrong code', async () => {
      const result = await api().verifyTwoFactor('999999');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('InvalidCode');
      }
    });

    it('returns TooManyAttempts for code 000000', async () => {
      const result = await api().verifyTwoFactor('000000');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('TooManyAttempts');
      }
    });
  });
});
