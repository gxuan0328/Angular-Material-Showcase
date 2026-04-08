/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update testimonial-sections/testimonial-section-4`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-testimonial-section-4',
  templateUrl: './testimonial-section-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class TestimonialSection4Component {
  companies = [
    {
      name: 'TechCorp',
      logo: 'https://placehold.co/160x64/e5e5e5/666?text=TechCorp',
    },
    {
      name: 'DataFlow',
      logo: 'https://placehold.co/160x64/e5e5e5/666?text=DataFlow',
    },
    {
      name: 'CloudNet',
      logo: 'https://placehold.co/160x64/e5e5e5/666?text=CloudNet',
    },
    {
      name: 'InnovateCo',
      logo: 'https://placehold.co/160x64/e5e5e5/666?text=InnovateCo',
    },
    {
      name: 'SecureBase',
      logo: 'https://placehold.co/160x64/e5e5e5/666?text=SecureBase',
    },
    {
      name: 'FastScale',
      logo: 'https://placehold.co/160x64/e5e5e5/666?text=FastScale',
    },
  ];
}
