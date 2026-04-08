import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { LandingLayout } from './landing-layout';

describe('LandingLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [LandingLayout],
    });
  });

  it('creates and renders a router-outlet', async () => {
    const fixture = TestBed.createComponent(LandingLayout);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });
});
