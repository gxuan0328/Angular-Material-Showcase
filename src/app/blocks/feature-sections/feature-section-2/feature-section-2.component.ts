/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-2`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type Feature = {
  name: string;
  description: string;
  icon: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-2',
  templateUrl: './feature-section-2.component.html',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection2Component {
  features: Feature[] = [
    {
      name: 'Use Database with your stack',
      description:
        'We offer client and server libraries in everything from React and Ruby to iOS.',
      icon: 'stack',
    },
    {
      name: 'Try plug & play options',
      description:
        'Customize and deploy data infrastructure directly from the Database Dashboard.',
      icon: 'power',
    },
    {
      name: 'Explore pre-built integrations',
      description:
        'Connect Database to over a hundred tools including Stripe, Salesforce, or Quickbooks.',
      icon: 'link',
    },
    {
      name: 'Security & privacy',
      description:
        'Database supports PII data encrypted with AES-256 at rest or explicit user consent flows.',
      icon: 'shield',
    },
  ];
}
