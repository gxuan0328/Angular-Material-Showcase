/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bento-grids/bento-grid-3`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type LaunchStep = {
  number: number;
  title: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-bento-grid-3',
  templateUrl: './bento-grid-3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class BentoGrid3Component {
  launchSteps: LaunchStep[] = [
    {
      number: 1,
      title: 'Configure',
      description: 'Set up your workspace in minutes',
    },
    {
      number: 2,
      title: 'Connect',
      description: 'Integrate your existing tools',
    },
    {
      number: 3,
      title: 'Deploy',
      description: 'Go live with one click',
    },
  ];
}
