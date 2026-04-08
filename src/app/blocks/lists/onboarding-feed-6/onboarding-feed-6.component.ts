/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/onboarding-feed-6`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

interface Step {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  timestamp?: string;
}

@Component({
  selector: 'ngm-dev-block-onboarding-feed-6',
  templateUrl: './onboarding-feed-6.component.html',
  imports: [MatIconModule, MatButtonModule, NgClass],
})
export class OnboardingFeed6Component {
  steps: Step[] = [
    {
      id: 1,
      title: 'Configure workspace',
      description:
        'Successfully configured initial workspace settings and preferences',
      status: 'completed',
      timestamp: '3d ago',
    },
    {
      id: 2,
      title: 'Set up data integration',
      description: 'Connected and verified PostgreSQL production database',
      status: 'completed',
      timestamp: '2d ago',
    },
    {
      id: 3,
      title: 'Configure billing',
      description: 'Added payment details for automatic monthly subscription',
      status: 'completed',
      timestamp: '31min ago',
    },
    {
      id: 4,
      title: 'Security scan',
      description: 'Running comprehensive security audit and compliance checks',
      status: 'in_progress',
    },
    {
      id: 5,
      title: 'Team collaboration',
      description: 'Set up team access and permissions',
      status: 'upcoming',
    },
  ];

  getStepIcon(step: Step): string {
    switch (step.status) {
      case 'completed':
        return 'check';
      case 'in_progress':
        return 'radio_button_checked';
      default:
        return 'radio_button_unchecked';
    }
  }

  getStepIconClass(step: Step): string {
    switch (step.status) {
      case 'completed':
        return 'text-primary!';
      case 'in_progress':
        return 'text-primary!';
      default:
        return 'text-outline!';
    }
  }
}
