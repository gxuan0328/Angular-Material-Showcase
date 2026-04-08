import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { OnboardingStore } from './onboarding-store';

describe('OnboardingStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), OnboardingStore],
    });
  });

  function create(): OnboardingStore {
    return TestBed.inject(OnboardingStore);
  }

  it('starts with dismissed=false and default steps', () => {
    const store = create();
    expect(store.dismissed()).toBe(false);
    expect(store.steps().length).toBeGreaterThan(0);
  });

  it('dismiss() persists to localStorage', () => {
    const store = create();
    store.dismiss();
    expect(store.dismissed()).toBe(true);
    expect(localStorage.getItem('onboarding.dismissed')).toBe('true');
  });

  it('reset() clears localStorage', () => {
    const store = create();
    store.dismiss();
    store.reset();
    expect(store.dismissed()).toBe(false);
    expect(localStorage.getItem('onboarding.dismissed')).toBeNull();
  });

  it('rehydrates dismissed=true from localStorage on startup', () => {
    localStorage.setItem('onboarding.dismissed', 'true');
    const store = create();
    expect(store.dismissed()).toBe(true);
  });
});
