/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stats-sections/stats-section-9`
*/

import { Component } from '@angular/core';

type StatsSectionStat = {
  id: number;
  badge: string;
  value: string;
  label: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-9',
  imports: [],
  templateUrl: './stats-section-9.component.html',
})
export class StatsSection9Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      badge: 'Security',
      value: 'SOC 2',
      label: 'Type II Certified',
      description: 'Enterprise-grade security standards',
    },
    {
      id: 2,
      badge: 'Performance',
      value: '<100ms',
      label: 'Global latency',
      description: 'Lightning-fast response times',
    },
    {
      id: 3,
      badge: 'Reliability',
      value: '99.99%',
      label: 'Uptime SLA',
      description: 'Always available when you need us',
    },
    {
      id: 4,
      badge: 'Support',
      value: '<15min',
      label: 'Response time',
      description: 'Dedicated support team',
    },
    {
      id: 5,
      badge: 'Scale',
      value: '10B+',
      label: 'API requests',
      description: 'Handled monthly',
    },
    {
      id: 6,
      badge: 'Trust',
      value: 'GDPR',
      label: 'Compliant',
      description: 'Full data privacy protection',
    },
  ];
}
