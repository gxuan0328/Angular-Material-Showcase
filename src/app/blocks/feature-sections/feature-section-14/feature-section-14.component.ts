/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-14`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-14',
  templateUrl: './feature-section-14.component.html',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection14Component {
  testimonials: Testimonial[] = [
    {
      quote:
        'The automation features have saved us countless hours. Our team can now focus on what really matters.',
      author: 'David Martinez',
      role: 'Operations Director',
      company: 'FlowTech Solutions',
    },
    {
      quote:
        'Implementation was seamless and the support team guided us every step of the way. Highly recommended!',
      author: 'Jennifer Kim',
      role: 'Product Manager',
      company: 'NextGen Innovations',
    },
    {
      quote:
        'We scaled from 10 to 100 team members without any hiccups. The platform grows with you effortlessly.',
      author: 'Robert Thompson',
      role: 'Founder',
      company: 'CloudBridge Systems',
    },
  ];
}
