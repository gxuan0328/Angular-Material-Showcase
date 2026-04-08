/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/onboarding-feed-8`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';

interface Step {
  id: number;
  type: 'created' | 'in progress';
  description: string;
  value: number;
  createdOn: string | null;
  runTime: string | null;
  tasksCompleted?: number;
  totalTasks?: number;
}

@Component({
  selector: 'ngm-dev-block-onboarding-feed-8',
  templateUrl: './onboarding-feed-8.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    NgClass,
    MatProgressBarModule,
    MatExpansionModule,
  ],
})
export class OnboardingFeed8Component {
  steps: Step[] = [
    {
      id: 1,
      type: 'created',
      description: 'Connect database',
      value: 100,
      createdOn: '2023-11-10 09:32',
      runTime: '15min 32s',
    },
    {
      id: 2,
      type: 'created',
      description: 'Import data',
      value: 100,
      createdOn: '2023-11-10 10:03',
      runTime: '21min 10s',
    },
    {
      id: 3,
      type: 'in progress',
      description: 'Create pipeline',
      value: 45,
      createdOn: null,
      runTime: null,
      tasksCompleted: 4,
      totalTasks: 6,
    },
  ];

  getStatusIcon(step: Step): string {
    return step.value === 100 ? 'check_circle' : 'progress_activity';
  }

  getStatusClass(step: Step): string {
    return step.value === 100 ? 'text-primary!' : 'text-primary! animate-spin';
  }

  isLastStep(index: number): boolean {
    return index === this.steps.length - 1;
  }
}
