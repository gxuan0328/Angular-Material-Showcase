/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update header-sections/header-section-2`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-header-section-2',
  templateUrl: './header-section-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class HeaderSection2Component {}
