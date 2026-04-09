import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Chart, registerables } from 'chart.js';

import { routes } from './app.routes';
import { AuthStore } from './core/auth/auth-store';
import { applyChartDefaults } from './core/charts/chart-defaults';
import { ThemeStore } from './core/theme/theme-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideNativeDateAdapter(),
    provideAppInitializer(() => {
      inject(AuthStore).restore();
    }),
    provideAppInitializer(() => {
      // Hydrate ThemeStore early so that its constructor effects attach
      // .dark and data-palette before any component renders.
      inject(ThemeStore);
    }),
    provideAppInitializer(() => {
      // Vendor blocks use <mat-icon>icon_name</mat-icon> ligature syntax
      // against the Material Symbols Outlined font family. Register the
      // default font-set class so mat-icon applies the right CSS class
      // (.material-symbols-outlined) instead of the legacy Material Icons.
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
    }),
    provideAppInitializer(() => {
      // chart.js v4 is tree-shakeable — register the components we use
      // (line, bar, doughnut, scale helpers, tooltip, legend) once at
      // startup so dashboards + catalog chart pages can draw.
      Chart.register(...registerables);
      applyChartDefaults();
    }),
  ],
};
