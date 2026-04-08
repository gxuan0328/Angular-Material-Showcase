/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update section-headings/section-heading-3`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-section-heading-3',
  templateUrl: './section-heading-3.component.html',
  imports: [MatButtonModule],
})
export class SectionHeading3Component {
  readonly title = 'Job Postings';
}
