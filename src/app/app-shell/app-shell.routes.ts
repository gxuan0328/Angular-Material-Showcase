import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';

export const APP_SHELL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: Dashboard, title: '儀表板' },
];
