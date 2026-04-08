/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-13`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type ComparisonFeature = {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-13',
  templateUrl: './feature-section-13.component.html',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection13Component {
  features: ComparisonFeature[] = [
    {
      name: 'Workspaces',
      basic: '1',
      pro: '5',
      enterprise: 'Unlimited',
    },
    {
      name: 'Users per workspace',
      basic: '2',
      pro: '15',
      enterprise: 'Unlimited',
    },
    {
      name: 'File storage',
      basic: '5 GB',
      pro: '250 GB',
      enterprise: '5 TB',
    },
    {
      name: 'Advanced features',
      basic: false,
      pro: true,
      enterprise: true,
    },
    {
      name: 'Dedicated support',
      basic: false,
      pro: true,
      enterprise: true,
    },
    {
      name: 'Custom branding',
      basic: false,
      pro: false,
      enterprise: true,
    },
  ];
}
