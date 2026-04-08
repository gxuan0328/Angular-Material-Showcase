import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  imports: [RouterOutlet],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'landing-layout' },
})
export class LandingLayout {}
