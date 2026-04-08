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

import { routes } from './app.routes';
import { AuthStore } from './core/auth/auth-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideAppInitializer(() => {
      inject(AuthStore).restore();
    }),
    provideAppInitializer(() => {
      // Vendor blocks use <mat-icon>icon_name</mat-icon> ligature syntax
      // against the Material Symbols Outlined font family. Register the
      // default font-set class so mat-icon applies the right CSS class
      // (.material-symbols-outlined) instead of the legacy Material Icons.
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
    }),
  ],
};
