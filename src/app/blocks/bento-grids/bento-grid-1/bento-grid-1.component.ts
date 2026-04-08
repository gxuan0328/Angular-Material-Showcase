/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bento-grids/bento-grid-1`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-bento-grid-1',
  templateUrl: './bento-grid-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class BentoGrid1Component {
  integrations = ['Slack', 'GitHub', 'Jira', 'Salesforce', 'Stripe', 'Zapier'];
}
