/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-stats-sections/stats-section-3`
*/

import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type StatsSectionStat = {
  id: number;
  icon: string;
  value: string;
  label: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-3',
  imports: [MatIcon],
  templateUrl: './stats-section-3.component.html',
})
export class StatsSection3Component {
  stats: StatsSectionStat[] = [
    {
      id: 1,
      icon: 'groups',
      value: '25K+',
      label: 'Team members',
      description: 'Collaborating on projects daily',
    },
    {
      id: 2,
      icon: 'rocket_launch',
      value: '500+',
      label: 'Projects deployed',
      description: 'Successfully launched to production',
    },
    {
      id: 3,
      icon: 'workspace_premium',
      value: '15+',
      label: 'Industry awards',
      description: 'Recognition for excellence',
    },
  ];
}
