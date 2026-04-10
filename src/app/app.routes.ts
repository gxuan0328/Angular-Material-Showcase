import { Routes } from '@angular/router';

import { authMatchGuard } from './core/auth/auth-match.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/landing-layout/landing-layout').then(m => m.LandingLayout),
    loadChildren: () => import('./landing/landing.routes').then(m => m.LANDING_ROUTES),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./layouts/catalog-layout/catalog-layout').then(m => m.CatalogLayout),
    loadChildren: () => import('./catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
  },
  {
    path: 'app',
    canMatch: [authMatchGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    loadChildren: () => import('./app-shell/app-shell.routes').then(m => m.APP_SHELL_ROUTES),
  },
  {
    path: 'guide',
    loadComponent: () =>
      import('./layouts/guide-layout/guide-layout').then(m => m.GuideLayout),
    loadChildren: () => import('./guide/guide.routes').then(m => m.GUIDE_ROUTES),
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
