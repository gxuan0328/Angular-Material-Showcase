/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update header-sections/header-section-6`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';

@Component({
  selector: 'ngm-dev-block-header-section-6',
  templateUrl: './header-section-6.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, MatFormField, MatInput, MatSuffix],
})
export class HeaderSection6Component {
  benefits = [
    { icon: 'check_circle', text: 'No credit card required' },
    { icon: 'check_circle', text: 'Cancel anytime' },
    { icon: 'check_circle', text: 'Access to all features' },
  ];
}
