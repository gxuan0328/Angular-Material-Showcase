import { Routes } from '@angular/router';

import { SettingsShell } from './settings-shell';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: SettingsShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
      {
        path: 'profile',
        loadComponent: () => import('./settings-profile').then(m => m.SettingsProfile),
        title: '個人檔案',
      },
      {
        path: 'security',
        loadComponent: () => import('./settings-security').then(m => m.SettingsSecurity),
        title: '安全設定',
      },
      {
        path: 'api-keys',
        loadComponent: () => import('./settings-api-keys').then(m => m.SettingsApiKeys),
        title: 'API 金鑰',
      },
      {
        path: 'integrations',
        loadComponent: () => import('./settings-integrations').then(m => m.SettingsIntegrations),
        title: '整合',
      },
      {
        path: 'preferences',
        loadComponent: () => import('./settings-preferences').then(m => m.SettingsPreferences),
        title: '偏好設定',
      },
    ],
  },
];
