/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update section-headings/section-heading-7`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'ngm-dev-block-section-heading-7',
  templateUrl: './section-heading-7.component.html',
  imports: [MatTabsModule, MatButtonModule],
})
export class SectionHeading7Component {
  readonly title = 'Candidates';
}
