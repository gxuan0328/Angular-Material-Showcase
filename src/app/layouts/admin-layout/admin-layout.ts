import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeToggle } from '../../core/theme/theme-toggle';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, ThemeToggle],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'admin-layout' },
})
export class AdminLayout {}
