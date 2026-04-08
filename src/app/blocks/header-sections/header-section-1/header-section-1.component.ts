/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update header-sections/header-section-1`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-header-section-1',
  templateUrl: './header-section-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class HeaderSection1Component {}
