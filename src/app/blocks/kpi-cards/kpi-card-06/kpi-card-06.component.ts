/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-06`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

type KpiData = {
  name: string;
  stat: string;
  change: string;
  changeType: 'positive' | 'negative';
};

@Component({
  selector: 'ngm-dev-block-kpi-card-06',
  imports: [MatCard, MatCardContent, MatIcon],
  templateUrl: './kpi-card-06.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard06Component {
  data: KpiData[] = [
    {
      name: 'Monthly active users',
      stat: '5,280',
      change: '18.7%',
      changeType: 'positive',
    },
    {
      name: 'Daily sessions',
      stat: '2,145',
      change: '11.4%',
      changeType: 'negative',
    },
    {
      name: 'Avg. duration',
      stat: '8.9min',
      change: '12.3%',
      changeType: 'positive',
    },
  ];
}
