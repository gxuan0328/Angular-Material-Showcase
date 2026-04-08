/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-stats-sections/stats-section-1`
*/

import { Component } from '@angular/core';

type StatsSectionStat = {
  id: number;
  value: string;
  label: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-1',
  imports: [],
  templateUrl: './stats-section-1.component.html',
})
export class StatsSection1Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      value: '12K+',
      label: 'Active users',
    },
    {
      id: 2,
      value: '99.9%',
      label: 'Uptime guarantee',
    },
    {
      id: 3,
      value: '24/7',
      label: 'Expert support',
    },
  ];
}
