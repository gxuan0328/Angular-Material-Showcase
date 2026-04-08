/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-04`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';

type KpiData = {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  href: string;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-04',
  imports: [MatCard, MatCardContent, MatCardFooter],
  templateUrl: './kpi-card-04.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard04Component {
  data: KpiData[] = [
    {
      name: 'Annual recurring revenue',
      value: '$52.3K',
      change: '+9.2%',
      changeType: 'positive',
      href: '#',
    },
    {
      name: 'Total customers',
      value: '823.7K',
      change: '+28.5%',
      changeType: 'positive',
      href: '#',
    },
    {
      name: 'Customer growth',
      value: '14.6%',
      change: '-0.8%',
      changeType: 'negative',
      href: '#',
    },
  ];
}
