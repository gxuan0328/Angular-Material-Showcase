/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update hero-sections/hero-section-8`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-hero-section-8',
  templateUrl: './hero-section-8.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class HeroSection8Component {}
