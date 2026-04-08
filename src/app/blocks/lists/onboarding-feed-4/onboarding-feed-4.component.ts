/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/onboarding-feed-4`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

interface Step {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  content?: {
    title: string;
    description: string;
    action: {
      label: string;
      icon?: string;
    };
  };
}

@Component({
  selector: 'ngm-dev-block-onboarding-feed-4',
  templateUrl: './onboarding-feed-4.component.html',
  styleUrls: ['./onboarding-feed-4.component.scss'],
  imports: [MatIconModule, MatButtonModule, NgClass, MatExpansionModule],
})
export class OnboardingFeed4Component {
  steps: Step[] = [
    {
      id: 1,
      title: 'Sign up and create workspace',
      description: 'You successfully created your account.',
      status: 'completed',
      content: {
        title: 'Account created',
        description:
          'You successfully created your account. Edit your account details anytime.',
        action: {
          label: 'Edit account',
        },
      },
    },
    {
      id: 2,
      title: 'Connect to data source',
      description: 'Connect to a data source.',
      status: 'current',
      content: {
        title: 'Create connection',
        description:
          'Connect to a data source. The platform supports more than 50 databases.',
        action: {
          label: 'Connect data source',
          icon: 'database',
        },
      },
    },
    {
      id: 3,
      title: 'Create metrics',
      description: 'Create metrics using custom SQL.',
      status: 'pending',
      content: {
        title: 'Create a metric',
        description:
          'Create metrics using custom SQL or our intuitive query mask.',
        action: {
          label: 'Create metric',
          icon: 'add_chart',
        },
      },
    },
    {
      id: 4,
      title: 'Create report',
      description: 'Transform metrics into visualizations.',
      status: 'pending',
      content: {
        title: 'Create a report',
        description:
          'Transform metrics into visualizations and arrange them visually.',
        action: {
          label: 'Create report',
          icon: 'dashboard',
        },
      },
    },
  ];

  getStepIconClass(step: Step): string {
    switch (step.status) {
      case 'completed':
        return 'text-green-700! dark:text-green-600!';
      case 'current':
        return 'text-primary!';
      default:
        return 'text-outline!';
    }
  }

  getStepContentClass(step: Step): string {
    if (step.status === 'current') {
      return 'bg-surface-container';
    }
    return '';
  }

  isExpanded(step: Step): boolean {
    return step.status === 'current';
  }
}
