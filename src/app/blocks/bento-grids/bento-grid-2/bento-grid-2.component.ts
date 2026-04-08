/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bento-grids/bento-grid-2`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type EnterpriseFeature = {
  icon: string;
  title: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-bento-grid-2',
  templateUrl: './bento-grid-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class BentoGrid2Component {
  aiFeatures = [
    'Smart automation',
    'Predictive insights',
    'Content generation',
  ];

  enterpriseFeatures: EnterpriseFeature[] = [
    {
      icon: 'verified_user',
      title: 'SOC 2 Compliant',
      description: 'Enterprise security standards',
    },
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'Dedicated account manager',
    },
    {
      icon: 'backup',
      title: 'Daily Backups',
      description: 'Automatic data protection',
    },
    {
      icon: 'lan',
      title: 'Custom Integrations',
      description: 'API access included',
    },
  ];
}
