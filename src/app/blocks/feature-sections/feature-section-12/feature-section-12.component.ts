/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-12`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type Feature = {
  title: string;
  description: string;
  icon: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-12',
  templateUrl: './feature-section-12.component.html',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection12Component {
  features: Feature[] = [
    {
      title: 'Intelligent design',
      description:
        'Built with user experience in mind. Every feature is designed to be intuitive and powerful.',
      icon: 'palette',
    },
    {
      title: 'Global reach',
      description:
        'Deploy across multiple regions for optimal performance and compliance worldwide.',
      icon: 'public',
    },
    {
      title: 'Future-proof platform',
      description:
        'Built on modern architecture that evolves with technology. Always stay ahead of the curve.',
      icon: 'rocket_launch',
    },
  ];
}
