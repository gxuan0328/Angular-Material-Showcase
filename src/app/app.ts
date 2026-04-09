import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ShowcaseSwitcher } from './core/showcase-switcher/showcase-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShowcaseSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
