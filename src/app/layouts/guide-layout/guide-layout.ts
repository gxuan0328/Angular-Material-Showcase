import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { GuideNav } from '../../guide/shared/guide-nav';
import { ThemeToggle } from '../../core/theme/theme-toggle';
import { ThemePaletteSelector } from '../../core/theme/theme-palette-selector';

@Component({
  selector: 'app-guide-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    GuideNav,
    ThemeToggle,
    ThemePaletteSelector,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './guide-layout.html',
  styleUrl: './guide-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'guide-layout',
    '[class.guide-layout--nav-hidden]': 'navHidden()',
  },
})
export class GuideLayout {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  protected readonly navHidden = signal<boolean>(
    typeof window !== 'undefined' && window.innerWidth < 960,
  );
  private readonly isMobile = signal<boolean>(
    typeof window !== 'undefined' && window.innerWidth < 960,
  );

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 959.98px)')
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        this.isMobile.set(result.matches);
        if (result.matches) {
          this.navHidden.set(true);
        }
      });

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        if (this.isMobile()) {
          this.navHidden.set(true);
        }
      });
  }

  protected toggleNav(): void {
    this.navHidden.update(v => !v);
  }

  protected hideNav(): void {
    this.navHidden.set(true);
  }
}
