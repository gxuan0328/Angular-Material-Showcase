/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-15`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

type Metric = {
  value: string;
  label: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-15',
  templateUrl: './feature-section-15.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection15Component {
  metrics: Metric[] = [
    {
      value: '99.99%',
      label: 'Reliability',
      description: 'Industry-leading uptime',
    },
    {
      value: '50K+',
      label: 'Companies',
      description: 'Growing every day',
    },
    {
      value: '200+',
      label: 'Integrations',
      description: 'Connect everything',
    },
    {
      value: '< 50ms',
      label: 'Response time',
      description: 'Lightning fast performance',
    },
  ];
}
