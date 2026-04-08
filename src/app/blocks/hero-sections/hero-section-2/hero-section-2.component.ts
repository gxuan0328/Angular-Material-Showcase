/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update hero-sections/hero-section-2`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-hero-section-2',
  templateUrl: './hero-section-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class HeroSection2Component {}
