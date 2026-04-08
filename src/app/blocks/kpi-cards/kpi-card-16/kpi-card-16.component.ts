/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-16`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ProgressCircleComponent } from '../../components/progress-circle/progress-circle.component';

type KpiData = {
  name: string;
  value: number;
};

type ProgressCircleVariant =
  | 'default'
  | 'neutral'
  | 'warning'
  | 'error'
  | 'success';

@Component({
  selector: 'ngm-dev-block-kpi-card-16',
  imports: [MatCard, MatCardContent, ProgressCircleComponent],
  templateUrl: './kpi-card-16.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard16Component {
  data: KpiData[] = [
    {
      name: 'Reliability',
      value: 88,
    },
    {
      name: 'Security',
      value: 72,
    },
    {
      name: 'Efficiency',
      value: 43,
    },
  ];

  getVariant(value: number): ProgressCircleVariant {
    if (value >= 75) return 'success';
    if (value > 50) return 'warning';
    return 'error';
  }
}
