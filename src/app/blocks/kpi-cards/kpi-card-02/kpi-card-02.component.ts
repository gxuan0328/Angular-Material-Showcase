/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-02`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

type KpiData = {
  name: string;
  stat: string;
  change: string;
  changeType: 'positive' | 'negative';
};

@Component({
  selector: 'ngm-dev-block-kpi-card-02',
  imports: [MatCard, MatCardContent],
  templateUrl: './kpi-card-02.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard02Component {
  data: KpiData[] = [
    {
      name: 'Weekly active users',
      stat: '4,720',
      change: '+15.8%',
      changeType: 'positive',
    },
    {
      name: 'Monthly sessions',
      stat: '2,156',
      change: '-6.3%',
      changeType: 'negative',
    },
    {
      name: 'Avg. session time',
      stat: '7.8min',
      change: '+11.2%',
      changeType: 'positive',
    },
  ];
}
