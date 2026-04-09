import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { MockSettingsApi } from './mock-settings';

describe('MockSettingsApi', () => {
  let api: MockSettingsApi;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(MockSettingsApi);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should load api keys and integrations', async () => {
    const loadPromise = api.load();
    httpCtrl.expectOne('assets/mock-data/api-keys.json').flush([{ id: 'k1', label: 'Test', prefix: 'sk_', lastFour: 'abcd', scopes: ['read'], createdAt: '2025-01-01T00:00:00Z', lastUsedAt: null }]);
    httpCtrl.expectOne('assets/mock-data/integrations.json').flush([]);
    await loadPromise;
    expect(api.loaded()).toBe(true);
    expect(api.apiKeys().length).toBe(1);
  });

  it('should update profile', async () => {
    const result = await api.updateProfile({ displayName: 'Bob' });
    expect(result.ok).toBe(true);
    expect(api.profile().displayName).toBe('Bob');
  });

  it('should enable and disable 2FA', async () => {
    const enableResult = await api.enableTwoFactor('totp');
    expect(enableResult.ok).toBe(true);
    expect(api.twoFactor().enabled).toBe(true);

    const disableResult = await api.disableTwoFactor();
    expect(disableResult.ok).toBe(true);
    expect(api.twoFactor().enabled).toBe(false);
  });

  it('should create and delete API key', async () => {
    const createResult = await api.createApiKey('Test Key', ['read']);
    expect(createResult.ok).toBe(true);
    if (createResult.ok) {
      expect(api.apiKeys().some(k => k.label === 'Test Key')).toBe(true);
      const deleteResult = await api.deleteApiKey(createResult.value.id);
      expect(deleteResult.ok).toBe(true);
      expect(api.apiKeys().some(k => k.label === 'Test Key')).toBe(false);
    }
  });

  it('should toggle integration', async () => {
    const loadPromise = api.load();
    httpCtrl.expectOne('assets/mock-data/api-keys.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/integrations.json').flush([
      { id: 'int-001', name: 'Slack', category: 'messaging', icon: 'chat', connected: false, connectedAt: null },
    ]);
    await loadPromise;

    const result = await api.toggleIntegration('int-001');
    expect(result.ok).toBe(true);
    expect(api.integrations()[0].connected).toBe(true);
  });

  it('should update preference', async () => {
    const result = await api.updatePreference('notifications', 'email-immediate', true);
    expect(result.ok).toBe(true);
    const group = api.preferences().find(g => g.id === 'notifications');
    const option = group?.options.find(o => o.id === 'email-immediate');
    expect(option?.enabled).toBe(true);
  });
});
