/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stats-sections/stats-section-5`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

type StatsSectionStat = {
  id: number;
  value: string;
  label: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-5',
  imports: [MatButton],
  templateUrl: './stats-section-5.component.html',
})
export class StatsSection5Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      value: '$2.4B',
      label: 'Revenue generated',
      description: 'For our clients',
    },
    {
      id: 2,
      value: '92%',
      label: 'Cost reduction',
      description: 'Average savings',
    },
    {
      id: 3,
      value: '48hrs',
      label: 'Setup time',
      description: 'From signup to launch',
    },
    {
      id: 4,
      value: '10x',
      label: 'ROI improvement',
      description: 'Within first year',
    },
  ];
}
