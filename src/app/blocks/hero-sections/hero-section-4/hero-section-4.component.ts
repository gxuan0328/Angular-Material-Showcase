/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update hero-sections/hero-section-4`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { DeviceMockSafariComponent } from '../../device-mocks/safari/safari.component';

@Component({
  selector: 'ngm-dev-block-hero-section-4',
  templateUrl: './hero-section-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, DeviceMockSafariComponent],
})
export class HeroSection4Component {}
