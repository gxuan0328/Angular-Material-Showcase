import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeToggle } from '../../core/theme/theme-toggle';

@Component({
  selector: 'app-landing-layout',
  imports: [RouterOutlet, ThemeToggle],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'landing-layout' },
})
export class LandingLayout {}
