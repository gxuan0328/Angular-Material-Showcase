import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CatalogNav } from './catalog-nav';

describe('CatalogNav', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [CatalogNav],
    });
  });

  it('renders Application and Marketing top sections', async () => {
    const fixture = TestBed.createComponent(CatalogNav);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const titles = Array.from(
      el.querySelectorAll<HTMLElement>('.catalog-nav__section-title'),
    ).map(h => h.textContent?.trim() ?? '');
    expect(titles).toEqual(['Application', 'Marketing']);
  });

  it('renders 43 entries total across both sections', async () => {
    const fixture = TestBed.createComponent(CatalogNav);
    await fixture.whenStable();
    const links = fixture.nativeElement.querySelectorAll('.catalog-nav__link');
    expect(links.length).toBe(43);
  });

  it('marks coming-soon entries with the soon badge', async () => {
    const fixture = TestBed.createComponent(CatalogNav);
    await fixture.whenStable();
    const badges = fixture.nativeElement.querySelectorAll('.catalog-nav__badge');
    // 33 of the 43 entries are coming-soon
    expect(badges.length).toBe(33);
  });
});
