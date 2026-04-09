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
];
