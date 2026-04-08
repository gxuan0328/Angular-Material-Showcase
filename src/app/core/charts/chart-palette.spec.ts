import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ChartPaletteService, withAlpha } from './chart-palette';

describe('ChartPaletteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ChartPaletteService],
    });
  });

  function service(): ChartPaletteService {
    return TestBed.inject(ChartPaletteService);
  }

  it('exposes a default palette before any CSS is applied', () => {
    const p = service().palette();
    expect(p.primary).toBeTruthy();
    expect(p.categorical.length).toBeGreaterThanOrEqual(5);
  });

  it('recompute() reads CSS variables from :root', async () => {
    document.documentElement.style.setProperty('--mat-sys-primary', '#112233');
    document.documentElement.style.setProperty('--mat-sys-tertiary', '#aabbcc');

    const svc = service();
    svc.recompute();
    await Promise.resolve();

    expect(svc.palette().primary).toBe('#112233');
    expect(svc.palette().tertiary).toBe('#aabbcc');

    // cleanup
    document.documentElement.style.removeProperty('--mat-sys-primary');
    document.documentElement.style.removeProperty('--mat-sys-tertiary');
  });

  it('lineDataset() returns a fill + borderColor config derived from primary', () => {
    const cfg = service().lineDataset();
    expect(cfg['borderColor']).toBeDefined();
    expect(cfg['backgroundColor']).toBeDefined();
    expect(cfg['fill']).toBe(true);
  });

  it('donutDataset(n) returns n background colors', () => {
    const cfg = service().donutDataset(5) as { backgroundColor: string[] };
    expect(cfg.backgroundColor.length).toBe(5);
  });

  it('lineDataset() applies caller overrides', () => {
    const cfg = service().lineDataset({ borderColor: '#ff0000' });
    expect(cfg['borderColor']).toBe('#ff0000');
  });
});

describe('withAlpha()', () => {
  it('expands #rgb hex to rgba()', () => {
    expect(withAlpha('#f00', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('expands #rrggbb hex to rgba()', () => {
    expect(withAlpha('#112233', 0.2)).toBe('rgba(17, 34, 51, 0.2)');
  });

  it('rewrites rgb() to rgba()', () => {
    expect(withAlpha('rgb(10, 20, 30)', 0.75)).toBe('rgba(10, 20, 30, 0.75)');
  });

  it('clamps alpha to [0, 1]', () => {
    expect(withAlpha('#000', 5)).toBe('rgba(0, 0, 0, 1)');
    expect(withAlpha('#000', -1)).toBe('rgba(0, 0, 0, 0)');
  });

  it('returns input when color is unparseable', () => {
    expect(withAlpha('not-a-color', 0.5)).toBe('not-a-color');
  });
});
