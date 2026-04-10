import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { CatalogNav } from '../../catalog/shared/catalog-nav/catalog-nav';
import { ThemeToggle } from '../../core/theme/theme-toggle';
import { ThemePaletteSelector } from '../../core/theme/theme-palette-selector';

@Component({
  selector: 'app-catalog-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    CatalogNav,
    ThemeToggle,
    ThemePaletteSelector,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './catalog-layout.html',
  styleUrl: './catalog-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'catalog-layout',
    '[class.catalog-layout--nav-hidden]': 'navHidden()',
  },
})
export class CatalogLayout {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  protected readonly navHidden = signal<boolean>(
    typeof window !== 'undefined' && window.innerWidth < 960,
  );
  private readonly isMobile = signal<boolean>(
    typeof window !== 'undefined' && window.innerWidth < 960,
  );

  constructor() {
    // Auto-hide nav on mobile screens
    this.breakpointObserver
      .observe('(max-width: 959.98px)')
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        this.isMobile.set(result.matches);
        if (result.matches) {
          this.navHidden.set(true);
        }
      });

    // Close mobile nav on route change
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
