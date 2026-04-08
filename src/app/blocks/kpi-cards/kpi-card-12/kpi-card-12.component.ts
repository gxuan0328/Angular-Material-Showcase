/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-12`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ProgressCircleComponent } from '../../components/progress-circle/progress-circle.component';

type KpiData = {
  name: string;
  capacity: number;
  current: number;
  allowed: number;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-12',
  imports: [MatCard, MatCardContent, MatIcon, ProgressCircleComponent],
  templateUrl: './kpi-card-12.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard12Component {
  data: KpiData[] = [
    {
      name: 'Projects',
      capacity: 35,
      current: 7,
      allowed: 20,
    },
    {
      name: 'Repositories',
      capacity: 15,
      current: 3,
      allowed: 20,
    },
    {
      name: 'API calls',
      capacity: 0,
      current: 0,
      allowed: 100,
    },
  ];
}
