/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update header-sections/header-section-4`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatChipSet, MatChip } from '@angular/material/chips';

@Component({
  selector: 'ngm-dev-block-header-section-4',
  templateUrl: './header-section-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, MatChipSet, MatChip],
})
export class HeaderSection4Component {
  stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];
}
