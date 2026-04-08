/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-26`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ProgressCircleComponent } from '../../components/progress-circle/progress-circle.component';

type Item = {
  label: string;
  value: string;
  color: string;
};

type CardData = {
  title: string;
  percentage: number;
  items: Item[];
};

@Component({
  selector: 'ngm-dev-block-kpi-card-26',
  imports: [MatCard, MatCardContent, ProgressCircleComponent],
  templateUrl: './kpi-card-26.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard26Component {
  cards: CardData[] = [
    {
      title: 'Uptime Compliance',
      percentage: 94,
      items: [
        {
          label: 'Meeting Target',
          value: '94.2%',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        {
          label: 'Below Target',
          value: '5.8%',
          color: 'bg-red-500 dark:bg-red-500',
        },
      ],
    },
    {
      title: 'Latency Metrics',
      percentage: 88,
      items: [
        {
          label: 'Acceptable',
          value: '88.4%',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        {
          label: 'High Latency',
          value: '11.6%',
          color: 'bg-red-500 dark:bg-red-500',
        },
      ],
    },
    {
      title: 'Memory Utilization',
      percentage: 65,
      items: [
        {
          label: 'Optimal',
          value: '64.8%',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        {
          label: 'High Usage',
          value: '35.2%',
          color: 'bg-red-500 dark:bg-red-500',
        },
      ],
    },
  ];
}
