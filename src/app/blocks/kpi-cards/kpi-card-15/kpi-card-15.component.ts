/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-15`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';

type KpiData = {
  name: string;
  stat: string;
  limit: string;
  percentage: number;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-15',
  imports: [MatCard, MatCardContent, MatProgressBar],
  templateUrl: './kpi-card-15.component.html',
  styleUrl: './kpi-card-15.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard15Component {
  data: KpiData[] = [
    {
      name: 'API Requests',
      stat: '1,842',
      limit: '25,000',
      percentage: 7.37,
    },
    {
      name: 'Storage',
      stat: '$1,256',
      limit: '$2,000',
      percentage: 62.8,
    },
    {
      name: 'Bandwidth',
      stat: '3.2GB',
      limit: '20GB',
      percentage: 16.0,
    },
  ];
}
