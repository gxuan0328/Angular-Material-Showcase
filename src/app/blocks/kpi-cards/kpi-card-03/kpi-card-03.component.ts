/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-03`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

type KpiData = {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
};

@Component({
  selector: 'ngm-dev-block-kpi-card-03',
  imports: [MatCard, MatCardContent],
  templateUrl: './kpi-card-03.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard03Component {
  data: KpiData[] = [
    {
      name: 'Monthly revenue',
      value: '$42.8K',
      change: '+8.4%',
      changeType: 'positive',
    },
    {
      name: 'Active subscribers',
      value: '687.3K',
      change: '+24.7%',
      changeType: 'positive',
    },
    {
      name: 'Churn rate',
      value: '8.6%',
      change: '-2.1%',
      changeType: 'negative',
    },
  ];
}
