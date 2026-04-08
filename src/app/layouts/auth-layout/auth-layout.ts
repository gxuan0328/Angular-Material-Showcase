import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeToggle } from '../../core/theme/theme-toggle';
import { ThemePaletteSelector } from '../../core/theme/theme-palette-selector';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, ThemeToggle, ThemePaletteSelector],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'auth-layout' },
})
export class AuthLayout {}
