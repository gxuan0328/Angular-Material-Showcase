/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-18`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type Feature = {
  name: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-18',
  templateUrl: './feature-section-18.component.html',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection18Component {
  features: Feature[] = [
    {
      name: 'Quick deployment',
      description:
        'Deploy your workspace in seconds with our one-click setup process.',
    },
    {
      name: 'Rich templates',
      description:
        'Choose from hundreds of pre-built templates to jumpstart your projects.',
    },
    {
      name: 'Expert guidance',
      description:
        'Get personalized help from our team of experts whenever you need it.',
    },
  ];
}
