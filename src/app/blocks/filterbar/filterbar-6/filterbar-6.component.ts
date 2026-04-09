/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-6`
*/

import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface WorkspaceItem {
  value: string;
  label: string;
  disabled: boolean;
}

interface WorkspaceGroup {
  label: string;
  items: WorkspaceItem[];
}

@Component({
  selector: 'ngm-dev-block-filterbar-6',
  templateUrl: './filterbar-6.component.html',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
})
export class Filterbar6Component {
  workspaceGroups: WorkspaceGroup[] = [
    {
      label: 'Team workspaces',
      items: [
        {
          value: 'test_workspace_us_west_01',
          label: 'test_workspace_us_west_01',
          disabled: false,
        },
        {
          value: 'live_workspace_frankfurt_02',
          label: 'live_workspace_frankfurt_02',
          disabled: false,
        },
        {
          value: 'live_workspace_zurich_01',
          label: 'live_workspace_zurich_01',
          disabled: false,
        },
        {
          value: 'ecommerce_analytics_api',
          label: 'ecommerce_analytics_api',
          disabled: true,
        },
      ],
    },
    {
      label: 'Private workspaces',
      items: [
        {
          value: 'private_workspace_US_east_02',
          label: 'private_workspace_US_east_02',
          disabled: false,
        },
        {
          value: 'private_workspace_frankfurt_01',
          label: 'private_workspace_frankfurt_01',
          disabled: false,
        },
      ],
    },
  ];

  createDashboard(): void {
    console.log('Create dashboard clicked');
  }

  selectWorkspace(workspace: WorkspaceItem): void {
    console.log('Selected workspace:', workspace);
  }
}
