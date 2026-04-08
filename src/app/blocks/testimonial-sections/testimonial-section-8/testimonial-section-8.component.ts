/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update testimonial-sections/testimonial-section-8`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-testimonial-section-8',
  templateUrl: './testimonial-section-8.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class TestimonialSection8Component {
  testimonials = [
    {
      content:
        'The migration process was smooth and painless. Support team walked us through every step. Zero downtime during the transition.',
      author: 'Thomas Anderson',
      role: 'Infrastructure Lead',
      image: 'https://placehold.co/80x80',
    },
    {
      content:
        'Performance improvements were immediate and substantial. Page load times dropped by 70% and our users noticed the difference right away.',
      author: 'Nina Patel',
      role: 'Performance Engineer',
      image: 'https://placehold.co/80x80',
    },
    {
      content:
        'The flexibility to customize workflows exactly how we need them is incredible. No more workarounds or compromises.',
      author: 'Chris Johnson',
      role: 'Product Owner',
      image: 'https://placehold.co/80x80',
    },
    {
      content:
        'Cost savings exceeded projections. We reduced infrastructure expenses by 45% while improving service quality.',
      author: 'Sophia Lee',
      role: 'CFO',
      image: 'https://placehold.co/80x80',
    },
    {
      content:
        'Onboarding new team members is effortless now. The intuitive interface means they are productive from day one.',
      author: 'Michael Brown',
      role: 'HR Director',
      image: 'https://placehold.co/80x80',
    },
    {
      content:
        'The mobile experience is exceptional. Our field teams can access everything they need, anywhere, anytime.',
      author: 'Elena Garcia',
      role: 'Operations Manager',
      image: 'https://placehold.co/80x80',
    },
  ];
}
