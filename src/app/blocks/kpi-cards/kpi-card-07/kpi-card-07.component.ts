/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-07`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

type KpiData = {
  name: string;
  stat: string;
  previousStat: string;
  change: string;
  changeType: 'positive' | 'negative';
};

@Component({
  selector: 'ngm-dev-block-kpi-card-07',
  imports: [MatCard, MatCardContent],
  templateUrl: './kpi-card-07.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard07Component {
  data: KpiData[] = [
    {
      name: 'Daily active users',
      stat: '518',
      previousStat: '620',
      change: '-16.5%',
      changeType: 'negative',
    },
    {
      name: 'Daily sessions',
      stat: '1,094',
      previousStat: '568',
      change: '+92.6%',
      changeType: 'positive',
    },
    {
      name: 'Daily page views',
      stat: '5,340',
      previousStat: '4,892',
      change: '+9.2%',
      changeType: 'positive',
    },
  ];
}
