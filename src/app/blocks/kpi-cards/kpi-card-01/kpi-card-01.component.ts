/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-01`
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
  selector: 'ngm-dev-block-kpi-card-01',
  imports: [MatCard, MatCardContent],
  templateUrl: './kpi-card-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard01Component {
  data: KpiData[] = [
    {
      name: 'Daily active users',
      stat: '12,450',
      change: '-8.2%',
      changeType: 'negative',
    },
    {
      name: 'Conversion rate',
      stat: '64.8%',
      change: '+2.4%',
      changeType: 'positive',
    },
    {
      name: 'Session duration',
      stat: '6.4min',
      change: '+15.3%',
      changeType: 'positive',
    },
  ];
}
