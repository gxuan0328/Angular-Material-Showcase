/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stats-sections/stats-section-4`
*/

import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

type StatsSectionStat = {
  id: number;
  value: string;
  label: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-4',
  imports: [MatCard, MatCardContent],
  templateUrl: './stats-section-4.component.html',
})
export class StatsSection4Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      value: '2.5M+',
      label: 'Downloads',
      description: 'Across all platforms',
    },
    {
      id: 2,
      value: '98%',
      label: 'Satisfaction rate',
      description: 'From customer surveys',
    },
    {
      id: 3,
      value: '150+',
      label: 'Integrations',
      description: 'With popular tools',
    },
    {
      id: 4,
      value: '24/7',
      label: 'Support',
      description: 'Always here to help',
    },
  ];
}
