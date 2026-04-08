/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-10`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type Feature = {
  name: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-10',
  templateUrl: './feature-section-10.component.html',
  imports: [MatIcon, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection10Component {
  features: Feature[] = [
    {
      name: 'Unlimited storage',
      description:
        'Never worry about running out of space with unlimited cloud storage.',
    },
    {
      name: 'Advanced permissions',
      description:
        'Control who can access what with granular permission settings.',
    },
    {
      name: 'Activity tracking',
      description:
        'Monitor all changes and updates with comprehensive activity logs.',
    },
    {
      name: 'Email notifications',
      description: 'Stay informed with customizable email alerts and updates.',
    },
    {
      name: 'Version history',
      description: 'Track every change and restore previous versions anytime.',
    },
    {
      name: 'White-label options',
      description: 'Customize the platform with your branding and domain.',
    },
  ];
}
