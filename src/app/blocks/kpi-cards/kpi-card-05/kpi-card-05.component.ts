/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-05`
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
  selector: 'ngm-dev-block-kpi-card-05',
  imports: [MatCard, MatCardContent],
  templateUrl: './kpi-card-05.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard05Component {
  data: KpiData[] = [
    {
      name: 'Weekly active users',
      stat: '425',
      previousStat: '510',
      change: '-16.7%',
      changeType: 'negative',
    },
    {
      name: 'Weekly sessions',
      stat: '894',
      previousStat: '462',
      change: '+93.5%',
      changeType: 'positive',
    },
    {
      name: 'Weekly page views',
      stat: '4,180',
      previousStat: '3,825',
      change: '+9.3%',
      changeType: 'positive',
    },
  ];
}
