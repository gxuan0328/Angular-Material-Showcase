/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update header-sections/header-section-3`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-header-section-3',
  templateUrl: './header-section-3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class HeaderSection3Component {
  features = [
    { icon: 'speed', text: '10x Faster Performance' },
    { icon: 'security', text: 'Enterprise-Grade Security' },
    { icon: 'cloud', text: 'Cloud-Native Architecture' },
  ];
}
