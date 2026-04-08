/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/onboarding-feed-7`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

interface Step {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  timestamp?: string;
}

interface Tab {
  id: string;
  label: string;
  count: number;
}

@Component({
  selector: 'ngm-dev-block-onboarding-feed-7',
  templateUrl: './onboarding-feed-7.component.html',
  imports: [MatIconModule, MatButtonModule, NgClass, MatTabsModule],
})
export class OnboardingFeed7Component {
  tabs: Tab[] = [
    { id: 'all', label: 'All Tasks', count: 8 },
    { id: 'completed', label: 'Completed', count: 3 },
    { id: 'in_progress', label: 'In Progress', count: 2 },
    { id: 'upcoming', label: 'Upcoming', count: 3 },
  ];

  steps: Step[] = [
    {
      id: 1,
      title: 'Configure Analytics Dashboard',
      description: 'Set up your analytics preferences and key metrics',
      status: 'completed',
      timestamp: '2 days ago',
    },
    {
      id: 2,
      title: 'Connect Data Sources',
      description: 'Link your data warehouses and databases',
      status: 'completed',
      timestamp: 'Yesterday',
    },
    {
      id: 3,
      title: 'Set Up Team Permissions',
      description: 'Define access levels for team members',
      status: 'completed',
      timestamp: '3 hours ago',
    },
    {
      id: 4,
      title: 'Create Custom Reports',
      description: 'Design reports for key business metrics',
      status: 'in_progress',
      timestamp: 'In progress',
    },
    {
      id: 5,
      title: 'Configure Alert Rules',
      description: 'Set up automated alerts for metric changes',
      status: 'in_progress',
      timestamp: 'In progress',
    },
    {
      id: 6,
      title: 'Schedule Automated Reports',
      description: 'Set up recurring report generation',
      status: 'upcoming',
    },
    {
      id: 7,
      title: 'Integration Setup',
      description: 'Connect with external tools and services',
      status: 'upcoming',
    },
    {
      id: 8,
      title: 'Team Training Session',
      description: 'Schedule onboarding for team members',
      status: 'upcoming',
    },
  ];

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'in_progress':
        return 'pending';
      default:
        return 'radio_button_unchecked';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-primary! icon-filled';
      case 'in_progress':
        return 'text-on-surface-variant! icon-filled';
      default:
        return 'text-on-surface-variant!';
    }
  }

  getFilteredSteps(tabId: string): Step[] {
    if (tabId === 'all') return this.steps;
    return this.steps.filter((step) => step.status === tabId);
  }
}
