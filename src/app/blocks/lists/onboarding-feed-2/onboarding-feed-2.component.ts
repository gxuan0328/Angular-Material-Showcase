/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/onboarding-feed-2`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'open';
}

@Component({
  selector: 'ngm-dev-block-onboarding-feed-2',
  templateUrl: './onboarding-feed-2.component.html',
  imports: [MatIconModule, MatButtonModule],
})
export class OnboardingFeed2Component {
  steps: Step[] = [
    {
      id: '1.',
      title: 'Complete workspace setup',
      description:
        'Your workspace is ready! You can customize workspace settings and invite team members at any time.',
      status: 'complete',
    },
    {
      id: '2.',
      title: 'Set up data integration',
      description:
        'Choose from our collection of 75+ pre-built connectors for popular databases and cloud services.',
      status: 'open',
    },
    {
      id: '3.',
      title: 'Define key indicators',
      description:
        'Build custom KPIs using our visual query builder or write your own SQL queries.',
      status: 'open',
    },
    {
      id: '4.',
      title: 'Build analytics dashboard',
      description:
        'Create interactive charts and dashboards with our drag-and-drop visualization tools.',
      status: 'open',
    },
  ];
}
