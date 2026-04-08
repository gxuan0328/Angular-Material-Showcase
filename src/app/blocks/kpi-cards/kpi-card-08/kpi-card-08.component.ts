/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-08`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

type KpiData = {
  name: string;
  stat: string;
  previousStat: string;
  change: string;
  changeType: 'positive' | 'negative';
};

@Component({
  selector: 'ngm-dev-block-kpi-card-08',
  imports: [MatCard, MatCardContent, MatIcon],
  templateUrl: './kpi-card-08.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard08Component {
  data: KpiData[] = [
    {
      name: 'Weekly active users',
      stat: '562',
      previousStat: '670',
      change: '16.1%',
      changeType: 'negative',
    },
    {
      name: 'Weekly sessions',
      stat: '1,156',
      previousStat: '602',
      change: '92.0%',
      changeType: 'positive',
    },
    {
      name: 'Weekly page views',
      stat: '5,680',
      previousStat: '5,198',
      change: '9.3%',
      changeType: 'positive',
    },
  ];
}
