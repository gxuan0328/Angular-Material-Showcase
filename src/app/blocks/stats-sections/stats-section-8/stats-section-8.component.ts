/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stats-sections/stats-section-8`
*/

import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type MainStat = {
  value: string;
  label: string;
  description: string;
};

type SupportingStat = {
  id: number;
  value: string;
  label: string;
};

@Component({
  selector: 'ngm-dev-block-stats-section-8',
  imports: [MatIcon],
  templateUrl: './stats-section-8.component.html',
})
export class StatsSection8Component {
  mainStat: MainStat = {
    value: '143%',
    label: 'Growth year over year',
    description:
      "We've consistently exceeded expectations, helping our clients achieve remarkable growth through our platform.",
  };

  supportingStats: SupportingStat[] = [
    {
      id: 1,
      value: '350K+',
      label: 'New customers this year',
    },
    {
      id: 2,
      value: '$850M',
      label: 'Platform transactions',
    },
    {
      id: 3,
      value: '4.8/5',
      label: 'Average customer rating',
    },
  ];
}
