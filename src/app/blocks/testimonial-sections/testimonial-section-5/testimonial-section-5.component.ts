/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update testimonial-sections/testimonial-section-5`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-testimonial-section-5',
  templateUrl: './testimonial-section-5.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class TestimonialSection5Component {
  testimonials = [
    {
      content:
        'Outstanding service and incredible results. The platform paid for itself within the first month of use.',
      author: 'Alex Turner',
      role: 'Founder',
      company: 'StartupX',
      image: 'https://placehold.co/80x80',
      rating: 5,
    },
    {
      content:
        'The customer support team is phenomenal. They helped us customize everything to our specific needs.',
      author: 'Maria Santos',
      role: 'Product Manager',
      company: 'DigitalWorks',
      image: 'https://placehold.co/80x80',
      rating: 5,
    },
    {
      content:
        'Integration was painless and the results speak for themselves. Our efficiency doubled overnight.',
      author: 'James Wilson',
      role: 'CTO',
      company: 'BuildersTech',
      image: 'https://placehold.co/80x80',
      rating: 5,
    },
  ];
}
