import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CatalogNav } from '../../catalog/shared/catalog-nav/catalog-nav';
import { ThemeToggle } from '../../core/theme/theme-toggle';
import { ThemePaletteSelector } from '../../core/theme/theme-palette-selector';

@Component({
  selector: 'app-catalog-layout',
  imports: [RouterOutlet, RouterLink, CatalogNav, ThemeToggle, ThemePaletteSelector],
  templateUrl: './catalog-layout.html',
  styleUrl: './catalog-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'catalog-layout' },
})
export class CatalogLayout {}
