/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update cta-sections/cta-section-10`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-cta-section-10',
  templateUrl: './cta-section-10.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class CtaSection10Component {
  features = [
    { icon: 'bolt', text: 'Lightning-fast setup' },
    { icon: 'lock', text: 'Enterprise security' },
    { icon: 'support', text: 'Dedicated support' },
  ];
}
