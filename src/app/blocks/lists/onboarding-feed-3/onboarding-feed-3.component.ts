/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/onboarding-feed-3`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass } from '@angular/common';

interface Step {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

@Component({
  selector: 'ngm-dev-block-onboarding-feed-3',
  templateUrl: './onboarding-feed-3.component.html',
  styleUrls: ['./onboarding-feed-3.component.scss'],
  imports: [MatIconModule, MatButtonModule, MatProgressBarModule, NgClass],
})
export class OnboardingFeed3Component {
  currentStep = 1;
  totalSteps = 4;

  steps: Step[] = [
    {
      id: 1,
      title: 'Configure workspace settings',
      description:
        'Great job setting up your workspace! You can modify these settings at any time.',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Set up data integration',
      description:
        'Choose from our collection of 75+ pre-built connectors for popular databases and cloud services.',
      status: 'current',
    },
    {
      id: 3,
      title: 'Define key indicators',
      description:
        'Build custom KPIs using our visual query builder or write your own SQL queries.',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Build analytics dashboard',
      description:
        'Create interactive charts and dashboards with our drag-and-drop visualization tools.',
      status: 'pending',
    },
  ];

  getStepStatus(step: Step): string {
    switch (step.status) {
      case 'completed':
        return 'text-primary!';
      case 'current':
        return 'text-on-surface!';
      default:
        return 'text-outline!';
    }
  }

  getStepIconClass(step: Step): string {
    if (step.status === 'completed') {
      return 'icon-filled size-6';
    }
    return 'size-6';
  }
}
