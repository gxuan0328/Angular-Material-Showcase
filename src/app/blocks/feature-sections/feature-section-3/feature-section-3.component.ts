/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-3`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

type Feature = {
  title: string;
  subtitle: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-3',
  templateUrl: './feature-section-3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection3Component {
  features: Feature[] = [
    {
      title: '1. Prototype',
      subtitle: 'Build fast, test early',
      description:
        'Quickly spin up a working model with libraries for popular frameworks like React.',
    },
    {
      title: '2. Present',
      subtitle: 'Showcase your vision',
      description:
        'Use intuitive plug & play features to prepare a live demo and deploy from our platform.',
    },
    {
      title: '3. Iterate',
      subtitle: 'Refine and improve',
      description:
        'Continuously enhance your product by integrating with over a hundred tools.',
    },
    {
      title: '4. Deploy',
      subtitle: 'Launch with confidence',
      description:
        'Deploy securely with encryption, ensuring data compliance and user consent.',
    },
  ];
}
