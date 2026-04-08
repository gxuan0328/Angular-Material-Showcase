/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-10`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

type KpiData = {
  name: string;
  stat: string;
  status: 'within' | 'critical' | 'observe';
  range: string;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-10',
  imports: [MatCard, MatCardContent, MatIcon],
  templateUrl: './kpi-card-10.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard10Component {
  data: KpiData[] = [
    {
      name: 'Weekly active users',
      stat: '482',
      status: 'within',
      range: '300-550',
    },
    {
      name: 'Daily sessions',
      stat: '184',
      status: 'critical',
      range: '700-1,500',
    },
    {
      name: 'Error rate',
      stat: '47',
      status: 'observe',
      range: '15-35',
    },
  ];
}
