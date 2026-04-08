/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-22`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';

type Detail = {
  name: string;
  value: string;
  percentageValue: number;
};

type KpiData = {
  name: string;
  total: string;
  details: Detail[];
};

@Component({
  selector: 'ngm-dev-block-kpi-card-22',
  imports: [MatCard, MatCardContent, MatProgressBar],
  templateUrl: './kpi-card-22.component.html',
  styleUrl: './kpi-card-22.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard22Component {
  data: KpiData[] = [
    {
      name: 'Average requests per session',
      total: '487',
      details: [
        {
          name: 'GET requests',
          value: '194',
          percentageValue: 40,
        },
        {
          name: 'POST requests',
          value: '293',
          percentageValue: 60,
        },
      ],
    },
    {
      name: 'Total requests',
      total: '6,842',
      details: [
        {
          name: 'GET requests',
          value: '2,395',
          percentageValue: 35,
        },
        {
          name: 'POST requests',
          value: '4,447',
          percentageValue: 65,
        },
      ],
    },
    {
      name: 'Total requests by enterprise tier',
      total: '2,180',
      details: [
        {
          name: 'GET requests',
          value: '545',
          percentageValue: 25,
        },
        {
          name: 'POST requests',
          value: '1,635',
          percentageValue: 75,
        },
      ],
    },
    {
      name: 'Total requests by standard tier',
      total: '4,662',
      details: [
        {
          name: 'GET requests',
          value: '1,352',
          percentageValue: 29,
        },
        {
          name: 'POST requests',
          value: '3,310',
          percentageValue: 71,
        },
      ],
    },
  ];
}
