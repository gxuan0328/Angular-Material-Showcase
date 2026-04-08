/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-21`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';

type Detail = {
  name: string;
  value: string;
};

type KpiData = {
  name: string;
  total: string;
  split: number[];
  details: Detail[];
};

@Component({
  selector: 'ngm-dev-block-kpi-card-21',
  imports: [MatCard, MatCardContent, CategoryBarComponent],
  templateUrl: './kpi-card-21.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard21Component {
  data: KpiData[] = [
    {
      name: 'Average requests per query',
      total: '487',
      split: [194, 293],
      details: [
        {
          name: 'Read requests',
          value: '194',
        },
        {
          name: 'Write requests',
          value: '293',
        },
      ],
    },
    {
      name: 'Total requests',
      total: '6,842',
      split: [2395, 4447],
      details: [
        {
          name: 'Read requests',
          value: '2,395',
        },
        {
          name: 'Write requests',
          value: '4,447',
        },
      ],
    },
    {
      name: 'Total requests by premium tier',
      total: '2,180',
      split: [545, 1635],
      details: [
        {
          name: 'Read requests',
          value: '545',
        },
        {
          name: 'Write requests',
          value: '1,635',
        },
      ],
    },
    {
      name: 'Total requests by standard tier',
      total: '4,662',
      split: [1352, 3310],
      details: [
        {
          name: 'Read requests',
          value: '1,352',
        },
        {
          name: 'Write requests',
          value: '3,310',
        },
      ],
    },
  ];

  getLegendColorClass(name: string): string {
    if (name === 'Read requests') {
      return 'bg-sky-500 dark:bg-sky-500';
    }
    return 'bg-indigo-500 dark:bg-indigo-500';
  }
}
