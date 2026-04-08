/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bento-grids/bento-grid-4`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

type Metric = {
  label: string;
  value: string;
  percentage: number;
};

@Component({
  selector: 'ngm-dev-block-bento-grid-4',
  templateUrl: './bento-grid-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton],
})
export class BentoGrid4Component {
  sdks = ['JavaScript', 'Python', 'Ruby', 'Go', 'PHP', 'Java'];

  metrics: Metric[] = [
    { label: 'API Response Time', value: '<50ms', percentage: 95 },
    { label: 'Uptime', value: '99.99%', percentage: 99.99 },
    { label: 'Request Success Rate', value: '99.9%', percentage: 99.9 },
  ];
}
