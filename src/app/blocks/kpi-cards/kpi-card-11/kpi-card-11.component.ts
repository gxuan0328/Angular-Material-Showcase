/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-11`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

type KpiData = {
  name: string;
  stat: string;
  goalsAchieved: number;
  status: 'within' | 'critical' | 'observe';
  href: string;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-11',
  imports: [MatCard, MatCardContent, MatIcon],
  templateUrl: './kpi-card-11.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard11Component {
  data: KpiData[] = [
    {
      name: 'Asia Pacific',
      stat: '$15,840',
      goalsAchieved: 4,
      status: 'observe',
      href: '#',
    },
    {
      name: 'North America',
      stat: '$22,680',
      goalsAchieved: 5,
      status: 'within',
      href: '#',
    },
    {
      name: 'Europe',
      stat: '$186,420',
      goalsAchieved: 2,
      status: 'critical',
      href: '#',
    },
  ];
}
