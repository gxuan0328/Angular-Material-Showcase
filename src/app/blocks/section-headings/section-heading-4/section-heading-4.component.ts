/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update section-headings/section-heading-4`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-section-heading-4',
  templateUrl: './section-heading-4.component.html',
  imports: [MatButtonModule],
})
export class SectionHeading4Component {
  readonly title = 'Job Postings';
}
