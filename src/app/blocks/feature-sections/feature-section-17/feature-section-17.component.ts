/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-17`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngm-dev-block-feature-section-17',
  templateUrl: './feature-section-17.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection17Component {
  codeExample = `// Initialize client
import { Client } from '@platform/sdk';

const client = new Client({
  apiKey: process.env.API_KEY,
  region: 'us-east-1'
});

// Create new workspace
const workspace = await client.workspaces.create({
  name: 'My Workspace',
  settings: { theme: 'dark' }
});

console.log('Workspace ID:', workspace.id);`;
}
