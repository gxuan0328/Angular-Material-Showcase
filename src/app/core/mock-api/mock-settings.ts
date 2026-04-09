import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthResult } from './mock-auth-api';

export interface UserProfile {
  readonly userId: string;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly locale: string;
  readonly timezone: string;
}

export interface TwoFactorState {
  readonly enabled: boolean;
  readonly method: 'none' | 'totp' | 'sms';
  readonly backupCodesGeneratedAt: string | null;
}

export interface ApiKey {
  readonly id: string;
  readonly label: string;
  readonly prefix: string;
  readonly lastFour: string;
  readonly scopes: readonly string[];
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
}

export type IntegrationCategory = 'messaging' | 'observability' | 'storage' | 'auth';

export interface Integration {
  readonly id: string;
  readonly name: string;
  readonly category: IntegrationCategory;
  readonly icon: string;
  readonly connected: boolean;
  readonly connectedAt: string | null;
}

export interface PreferenceOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
}

export interface PreferenceGroup {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly options: readonly PreferenceOption[];
}

function delay(ms = 120): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const DEFAULT_PROFILE: UserProfile = {
  userId: 'u-alice',
  displayName: 'Alice Chen',
  email: 'alice@glacier.io',
  avatarUrl: '',
  locale: 'zh-TW',
  timezone: 'Asia/Taipei',
};

const DEFAULT_2FA: TwoFactorState = {
  enabled: false,
  method: 'none',
  backupCodesGeneratedAt: null,
};

const DEFAULT_PREFERENCES: readonly PreferenceGroup[] = [
  {
    id: 'notifications',
    title: '通知偏好',
    description: '控制何時接收通知以及接收方式',
    options: [
      { id: 'email-digest', label: 'Email 每日摘要', description: '每天發送一封彙整 email', enabled: true },
      { id: 'email-immediate', label: '即時 Email 通知', description: '有新通知時立即寄送', enabled: false },
      { id: 'in-app', label: '應用內通知', description: '在應用右上角顯示通知鈴', enabled: true },
      { id: 'browser-push', label: '瀏覽器推播', description: '透過 Web Push 發送通知', enabled: false },
    ],
  },
  {
    id: 'privacy',
    title: '隱私設定',
    description: '控制資料收集與分享',
    options: [
      { id: 'analytics', label: '使用分析', description: '允許匿名收集使用行為以改善產品', enabled: true },
      { id: 'marketing', label: '行銷通訊', description: '接收產品更新與特別優惠', enabled: false },
    ],
  },
  {
    id: 'appearance',
    title: '外觀設定',
    description: '調整介面外觀',
    options: [
      { id: 'compact-mode', label: '緊湊模式', description: '減少間距以顯示更多內容', enabled: false },
      { id: 'high-contrast', label: '高對比模式', description: '增加色彩對比度以改善可讀性', enabled: false },
    ],
  },
];

/**
 * In-memory settings API. Profile and preferences are inlined;
 * API keys and integrations loaded from JSON fixtures.
 */
@Injectable({ providedIn: 'root' })
export class MockSettingsApi {
  private readonly http = inject(HttpClient);

  private readonly _profile = signal<UserProfile>(DEFAULT_PROFILE);
  private readonly _twoFactor = signal<TwoFactorState>(DEFAULT_2FA);
  private readonly _apiKeys = signal<readonly ApiKey[]>([]);
  private readonly _integrations = signal<readonly Integration[]>([]);
  private readonly _preferences = signal<readonly PreferenceGroup[]>(DEFAULT_PREFERENCES);
  private readonly _loaded = signal<boolean>(false);

  readonly profile: Signal<UserProfile> = this._profile.asReadonly();
  readonly twoFactor: Signal<TwoFactorState> = this._twoFactor.asReadonly();
  readonly apiKeys: Signal<readonly ApiKey[]> = this._apiKeys.asReadonly();
  readonly integrations: Signal<readonly Integration[]> = this._integrations.asReadonly();
  readonly preferences: Signal<readonly PreferenceGroup[]> = this._preferences.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();

  async load(): Promise<void> {
    if (this._loaded()) return;
    const [apiKeys, integrations] = await Promise.all([
      firstValueFrom(this.http.get<readonly ApiKey[]>('assets/mock-data/api-keys.json')),
      firstValueFrom(this.http.get<readonly Integration[]>('assets/mock-data/integrations.json')),
    ]);
    this._apiKeys.set(apiKeys);
    this._integrations.set(integrations);
    this._loaded.set(true);
  }

  async updateProfile(patch: Partial<Omit<UserProfile, 'userId' | 'email'>>): Promise<AuthResult<UserProfile>> {
    await delay();
    const updated = { ...this._profile(), ...patch };
    this._profile.set(updated);
    return { ok: true, value: updated };
  }

  async enableTwoFactor(method: 'totp' | 'sms'): Promise<AuthResult<TwoFactorState>> {
    await delay();
    const state: TwoFactorState = {
      enabled: true,
      method,
      backupCodesGeneratedAt: new Date().toISOString(),
    };
    this._twoFactor.set(state);
    return { ok: true, value: state };
  }

  async disableTwoFactor(): Promise<AuthResult<TwoFactorState>> {
    await delay();
    this._twoFactor.set(DEFAULT_2FA);
    return { ok: true, value: DEFAULT_2FA };
  }

  async createApiKey(label: string, scopes: readonly string[]): Promise<AuthResult<ApiKey>> {
    await delay();
    const key: ApiKey = {
      id: `key-${Date.now()}`,
      label,
      prefix: 'sk_live_',
      lastFour: Math.random().toString(36).slice(-4),
      scopes,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
    };
    this._apiKeys.update(list => [key, ...list]);
    return { ok: true, value: key };
  }

  async deleteApiKey(id: string): Promise<AuthResult<void>> {
    await delay();
    if (!this._apiKeys().some(k => k.id === id)) {
      return { ok: false, error: 'NotFound' };
    }
    this._apiKeys.update(list => list.filter(k => k.id !== id));
    return { ok: true, value: undefined };
  }

  async toggleIntegration(id: string): Promise<AuthResult<Integration>> {
    await delay();
    const integration = this._integrations().find(i => i.id === id);
    if (!integration) return { ok: false, error: 'NotFound' };
    const updated: Integration = {
      ...integration,
      connected: !integration.connected,
      connectedAt: !integration.connected ? new Date().toISOString() : null,
    };
    this._integrations.update(list => list.map(i => (i.id === id ? updated : i)));
    return { ok: true, value: updated };
  }

  async updatePreference(groupId: string, optionId: string, enabled: boolean): Promise<AuthResult<void>> {
    await delay();
    this._preferences.update(groups =>
      groups.map(g =>
        g.id === groupId
          ? { ...g, options: g.options.map(o => (o.id === optionId ? { ...o, enabled } : o)) }
          : g,
      ),
    );
    return { ok: true, value: undefined };
  }
}
