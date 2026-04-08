/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-13`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { ProgressCircleComponent } from '../../components/progress-circle/progress-circle.component';

type KpiData = {
  name: string;
  progress: number;
  budget: string;
  current: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-13',
  imports: [MatCard, MatCardContent, MatCardFooter, ProgressCircleComponent],
  templateUrl: './kpi-card-13.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard13Component {
  data: KpiData[] = [
    {
      name: 'Engineering',
      progress: 42,
      budget: '$2,500',
      current: '$1,050',
      href: '#',
    },
    {
      name: 'Sales',
      progress: 68,
      budget: '$1,800',
      current: '$1,224',
      href: '#',
    },
    {
      name: 'Operations',
      progress: 91,
      budget: '$1,200',
      current: '$1,092',
      href: '#',
    },
  ];
}
