import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AuthStore } from '../../core/auth/auth-store';
import { ThemeToggle } from '../../core/theme/theme-toggle';
import { ThemePaletteSelector } from '../../core/theme/theme-palette-selector';

interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly path: string;
  readonly exact?: boolean;
  readonly soon?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'dashboard', label: '儀表板', icon: 'dashboard', path: '/app/dashboard', exact: true },
  { id: 'users', label: '使用者管理', icon: 'group', path: '/app/users' },
  { id: 'teams', label: '團隊與成員', icon: 'groups', path: '/app/teams' },
  {
    id: 'notifications',
    label: '通知中心',
    icon: 'notifications',
    path: '/app/notifications',
  },
  { id: 'billing', label: '計費與用量', icon: 'credit_card', path: '/app/billing' },
  { id: 'reports', label: '報表分析', icon: 'insights', path: '/app/reports' },
  { id: 'settings', label: '設定', icon: 'settings', path: '/app/settings' },
] as const;

/**
 * Admin shell — left sidenav + topbar with theme controls and a user menu.
 * After M4, all 7 nav items point at live /app/* routes.
 * Signing out returns the user to /auth/sign-in.
 */
@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
    ThemeToggle,
    ThemePaletteSelector,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'admin-layout' },
})
export class AdminLayout {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthStore);

  protected readonly navItems = NAV_ITEMS;
  protected readonly sidenavOpen = signal<boolean>(true);

  protected toggleSidenav(): void {
    this.sidenavOpen.update(open => !open);
  }

  protected async signOut(): Promise<void> {
    this.auth.signOut();
    await this.router.navigate(['/auth/sign-in']);
  }

  protected initials(): string {
    const user = this.auth.user();
    if (!user) return '?';
    const raw = user.displayName || user.email;
    const parts = raw.split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return raw.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
}
