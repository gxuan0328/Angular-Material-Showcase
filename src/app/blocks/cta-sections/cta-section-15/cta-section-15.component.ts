/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update cta-sections/cta-section-15`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-cta-section-15',
  templateUrl: './cta-section-15.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class CtaSection15Component {
  testimonials = [
    {
      quote:
        'This platform has completely transformed how we operate. Highly recommended!',
      author: 'Sarah Johnson',
      role: 'CEO, TechCorp',
    },
    {
      quote: 'The best investment we made this year. ROI was immediate.',
      author: 'Michael Chen',
      role: 'Director, InnovateLabs',
    },
  ];
}
