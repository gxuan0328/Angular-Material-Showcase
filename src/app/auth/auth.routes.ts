import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  {
    path: 'sign-in',
    title: '登入 · Glacier Analytics',
    loadComponent: () => import('./sign-in/sign-in').then(m => m.SignIn),
  },
  {
    path: 'sign-up',
    title: '註冊 · Glacier Analytics',
    loadComponent: () => import('./sign-up/sign-up').then(m => m.SignUp),
  },
  {
    path: 'forgot-password',
    title: '忘記密碼 · Glacier Analytics',
    loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPassword),
  },
  {
    path: 'reset-password',
    title: '重設密碼 · Glacier Analytics',
    loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPassword),
  },
  {
    path: 'two-factor',
    title: '雙因子驗證 · Glacier Analytics',
    loadComponent: () => import('./two-factor/two-factor').then(m => m.TwoFactor),
  },
  {
    path: 'check-email',
    title: '請檢查信箱 · Glacier Analytics',
    loadComponent: () => import('./check-email/check-email').then(m => m.CheckEmail),
  },
];
