/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update testimonial-sections/testimonial-section-2`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-testimonial-section-2',
  templateUrl: './testimonial-section-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class TestimonialSection2Component {
  testimonials = [
    {
      content:
        'The analytics dashboard gives us insights we never had before. Decision-making has become data-driven and strategic.',
      author: 'Marcus Chen',
      role: 'Head of Product',
      company: 'DataFlow Systems',
      image: 'https://placehold.co/96x96',
    },
    {
      content:
        'Implementation was seamless and support has been outstanding. Our ROI exceeded expectations within the first quarter.',
      author: 'Emily Rodriguez',
      role: 'Chief Operations Officer',
      company: 'Global Retail Co.',
      image: 'https://placehold.co/96x96',
    },
    {
      content:
        'Security features are top-notch and compliance requirements are easily met. Our clients trust us more because of it.',
      author: 'David Thompson',
      role: 'Security Director',
      company: 'FinanceHub Ltd.',
      image: 'https://placehold.co/96x96',
    },
    {
      content:
        'The automation capabilities freed up our team to focus on innovation rather than repetitive tasks. Game changer.',
      author: 'Lisa Wang',
      role: 'Engineering Manager',
      company: 'CloudScale Inc.',
      image: 'https://placehold.co/96x96',
    },
  ];
}
