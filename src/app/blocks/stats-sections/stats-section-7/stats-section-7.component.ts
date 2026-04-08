/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stats-sections/stats-section-7`
*/

import { Component } from '@angular/core';

type StatsSectionStat = {
  id: number;
  value: string;
  label: string;
  subtext?: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-7',
  imports: [],
  templateUrl: './stats-section-7.component.html',
})
export class StatsSection7Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      value: '8M+',
      label: 'Transactions',
      subtext: 'Processed daily',
    },
    {
      id: 2,
      value: '4.5★',
      label: 'App rating',
      subtext: 'On all stores',
    },
    {
      id: 3,
      value: '300+',
      label: 'Team members',
      subtext: 'Across the globe',
    },
    {
      id: 4,
      value: '12+',
      label: 'Years experience',
      subtext: 'Industry leading',
    },
  ];
}
