/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-20`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

type Activity = {
  type: string;
  share: string;
  zone: string;
  href: string;
};

type KpiData = {
  name: string;
  stat: string;
  unit: string;
  activities: Activity[];
};

@Component({
  selector: 'ngm-dev-block-kpi-card-20',
  imports: [MatCard, MatCardContent],
  templateUrl: './kpi-card-20.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard20Component {
  data: KpiData[] = [
    {
      name: 'Swimming',
      stat: '142',
      unit: 'bpm',
      activities: [
        {
          type: 'Easy',
          share: '32.8%',
          zone: '<120',
          href: '#',
        },
        {
          type: 'Moderate',
          share: '42.1%',
          zone: '120-145',
          href: '#',
        },
        {
          type: 'Hard',
          share: '18.5%',
          zone: '145-165',
          href: '#',
        },
        {
          type: 'Maximum',
          share: '6.6%',
          zone: '165-180',
          href: '#',
        },
      ],
    },
    {
      name: 'Yoga',
      stat: '98',
      unit: 'bpm',
      activities: [
        {
          type: 'Easy',
          share: '28.4%',
          zone: '<120',
          href: '#',
        },
        {
          type: 'Moderate',
          share: '52.8%',
          zone: '120-145',
          href: '#',
        },
        {
          type: 'Hard',
          share: '14.2%',
          zone: '145-165',
          href: '#',
        },
        {
          type: 'Maximum',
          share: '4.6%',
          zone: '165-180',
          href: '#',
        },
      ],
    },
    {
      name: 'Walking',
      stat: '85',
      unit: 'bpm',
      activities: [
        {
          type: 'Easy',
          share: '85.2%',
          zone: '<120',
          href: '#',
        },
        {
          type: 'Moderate',
          share: '12.4%',
          zone: '120-145',
          href: '#',
        },
        {
          type: 'Hard',
          share: '2.1%',
          zone: '145-165',
          href: '#',
        },
        {
          type: 'Maximum',
          share: '0.3%',
          zone: '165-180',
          href: '#',
        },
      ],
    },
  ];
}
