/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update testimonial-sections/testimonial-section-7`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-testimonial-section-7',
  templateUrl: './testimonial-section-7.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class TestimonialSection7Component {
  testimonials = [
    {
      content:
        'The collaboration features have completely changed how our distributed team works together. Real-time updates keep everyone aligned.',
      author: 'Kevin Martinez',
      role: 'Team Lead',
      company: 'RemoteFirst Inc.',
      image: 'https://placehold.co/96x96',
    },
    {
      content:
        'Reporting capabilities are exceptional. We can now track metrics that were impossible to measure before. Data-driven decisions are the norm.',
      author: 'Rachel Kim',
      role: 'Analytics Director',
      company: 'MetricsHub',
      image: 'https://placehold.co/96x96',
    },
  ];
}
