import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';

export const APP_SHELL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: Dashboard, title: '儀表板' },
  {
    path: 'users',
    title: '使用者管理',
    loadComponent: () => import('./users/users').then(m => m.Users),
  },
  {
    path: 'users/new',
    title: '新增使用者',
    loadComponent: () => import('./users/user-new').then(m => m.UserNew),
  },
  {
    path: 'users/:id',
    title: '使用者詳情',
    loadComponent: () => import('./users/user-detail').then(m => m.UserDetail),
  },
  {
    path: 'teams',
    title: '團隊與成員',
    loadComponent: () => import('./teams/teams').then(m => m.Teams),
  },
  {
    path: 'notifications',
    title: '通知中心',
    loadComponent: () => import('./notifications/notifications').then(m => m.Notifications),
  },
  {
    path: 'billing',
    title: '計費中心',
    loadChildren: () => import('./billing/billing.routes').then(m => m.BILLING_ROUTES),
  },
  {
    path: 'reports',
    title: '報表分析',
    loadComponent: () => import('./reports/reports').then(m => m.Reports),
  },
  {
    path: 'settings',
    title: '設定',
    loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES),
  },
];
