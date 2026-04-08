import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CatalogNav } from '../../catalog/shared/catalog-nav/catalog-nav';
import { ThemeToggle } from '../../core/theme/theme-toggle';

@Component({
  selector: 'app-catalog-layout',
  imports: [RouterOutlet, RouterLink, CatalogNav, ThemeToggle],
  templateUrl: './catalog-layout.html',
  styleUrl: './catalog-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'catalog-layout' },
})
export class CatalogLayout {}
