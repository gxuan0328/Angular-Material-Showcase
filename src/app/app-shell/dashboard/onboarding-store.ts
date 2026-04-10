import { Injectable, signal, Signal } from '@angular/core';

const STORAGE_KEY = 'onboarding.dismissed';

export interface OnboardingStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly done: boolean;
  readonly href?: string;
}

const DEFAULT_STEPS: readonly OnboardingStep[] = [
  {
    id: 'connect-source',
    title: '連結資料來源',
    description: '接上你的數據倉儲或 GA4 以開始追蹤真實指標。',
    done: false,
    href: '/app/settings',
  },
  {
    id: 'invite-team',
    title: '邀請團隊成員',
    description: '建立多使用者工作區，設定角色與權限。',
    done: false,
    href: '/app/users',
  },
  {
    id: 'create-dashboard',
    title: '建立第一個看板',
    description: '以預設範本或從零開始組合 KPI 卡片、圖表與列表。',
    done: true,
  },
  {
    id: 'set-alerts',
    title: '設定指標警示',
    description: '當關鍵指標偏離閾值時收到通知。',
    done: false,
    href: '/app/notifications',
  },
];

/**
 * Lightweight store that persists whether the onboarding checklist has been
 * dismissed by the user. Reads from localStorage on construction; writes on
 * dismiss. Kept intentionally small — the dashboard owns the render logic.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingStore {
  private readonly _dismissed = signal<boolean>(this.readFromStorage());
  private readonly _steps = signal<readonly OnboardingStep[]>(DEFAULT_STEPS);

  readonly dismissed: Signal<boolean> = this._dismissed.asReadonly();
  readonly steps: Signal<readonly OnboardingStep[]> = this._steps.asReadonly();

  dismiss(): void {
    this._dismissed.set(true);
    this.writeToStorage(true);
  }

  reset(): void {
    this._dismissed.set(false);
    this._steps.set(DEFAULT_STEPS);
    this.writeToStorage(false);
  }

  toggleStep(id: string): void {
    this._steps.update(steps =>
      steps.map(s => (s.id === id ? { ...s, done: !s.done } : s)),
    );
  }

  nextIncompleteStep(): OnboardingStep | undefined {
    return this._steps().find(s => !s.done);
  }

  private readFromStorage(): boolean {
    if (typeof localStorage === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  private writeToStorage(value: boolean): void {
    if (typeof localStorage === 'undefined') return;
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }
}
