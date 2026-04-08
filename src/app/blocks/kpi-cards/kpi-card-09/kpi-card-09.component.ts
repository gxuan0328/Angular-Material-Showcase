/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-09`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

type KpiData = {
  name: string;
  stat: string;
  change: string;
  color: string;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-09',
  imports: [MatCard, MatCardContent],
  templateUrl: './kpi-card-09.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard09Component {
  data: KpiData[] = [
    {
      name: 'Quarterly active users',
      stat: '1,284',
      change: '+2.7%',
      color: 'bg-blue-500',
    },
    {
      name: 'Quarterly sessions',
      stat: '2,850',
      change: '+12.4%',
      color: 'bg-violet-500',
    },
    {
      name: 'Quarterly user growth',
      stat: '7.3%',
      change: '-3.2%',
      color: 'bg-fuchsia-500',
    },
  ];
}
