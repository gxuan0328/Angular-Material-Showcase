/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stats-sections/stats-section-6`
*/

import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type StatsSectionStat = {
  id: number;
  icon: string;
  value: string;
  label: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-6',
  imports: [MatIcon],
  templateUrl: './stats-section-6.component.html',
})
export class StatsSection6Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      icon: 'language',
      value: '95+',
      label: 'Languages supported',
    },
    {
      id: 2,
      icon: 'cloud_done',
      value: '99.99%',
      label: 'Service uptime',
    },
    {
      id: 3,
      icon: 'speed',
      value: '3x',
      label: 'Faster performance',
    },
  ];
}
