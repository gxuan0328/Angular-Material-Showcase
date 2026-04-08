/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-stats-sections/stats-section-2`
*/

import { Component } from '@angular/core';

type StatsSectionStat = {
  id: number;
  value: string;
  label: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-2',
  imports: [],
  templateUrl: './stats-section-2.component.html',
})
export class StatsSection2Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      value: '50M+',
      label: 'API calls',
      description: 'Processed monthly across our infrastructure',
    },
    {
      id: 2,
      value: '180+',
      label: 'Countries',
      description: 'Serving customers around the globe',
    },
    {
      id: 3,
      value: '4.9/5',
      label: 'Customer rating',
      description: 'Based on verified reviews',
    },
    {
      id: 4,
      value: '<2ms',
      label: 'Response time',
      description: 'Average API latency worldwide',
    },
  ];
}
