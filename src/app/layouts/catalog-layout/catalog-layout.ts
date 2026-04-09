import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  protected readonly navHidden = signal<boolean>(false);

  protected toggleNav(): void {
    this.navHidden.update(v => !v);
  }
}
