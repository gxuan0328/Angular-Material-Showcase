/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update cta-sections/cta-section-9`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-cta-section-9',
  templateUrl: './cta-section-9.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class CtaSection9Component {
  stats = [
    { value: '99%', label: 'Customer satisfaction' },
    { value: '50K+', label: 'Active users' },
    { value: '24/7', label: 'Support available' },
  ];
}
