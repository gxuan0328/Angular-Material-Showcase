/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bento-grids/bento-grid-5`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

type Stat = {
  label: string;
  value: string;
};

@Component({
  selector: 'ngm-dev-block-bento-grid-5',
  templateUrl: './bento-grid-5.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton],
})
export class BentoGrid5Component {
  stats: Stat[] = [
    { label: 'Uptime', value: '99.99%' },
    { label: 'Response', value: '<50ms' },
    { label: 'Users', value: '2M+' },
  ];
}
