/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-1`
*/

import { Component, computed, signal } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

type WorkspaceOption = {
  value: string;
  label: string;
  icon: string;
  description: string;
  disabled: boolean;
};

@Component({
  selector: 'ngm-dev-block-filterbar-1',
  templateUrl: './filterbar-1.component.html',
  imports: [MatSelectModule, MatTooltipModule, MatIconModule],
})
export class Filterbar1Component {
  workspaceOptions: WorkspaceOption[] = [
    {
      value: 'free-workspace',
      label: 'Free workspace',
      icon: 'layers',
      description: 'Up to 1,000/req. per day,\n$0.45 per stored GB',
      disabled: false,
    },
    {
      value: 'pro-workspace',
      label: 'Pro workspace',
      icon: 'stacks',
      description: 'Up to 100,000/req. per day,\n$0.34 per stored GB',
      disabled: false,
    },
    {
      value: 'enterprise-workspace',
      label: 'Enterprise workspace',
      icon: 'business',
      description: '',
      disabled: true,
    },
  ];

  selectedWorkspace = signal('pro-workspace');
  selectedWorkspaceIcon = computed(() => {
    return this.workspaceOptions.find(
      (option) => option.value === this.selectedWorkspace(),
    )?.icon;
  });
  selectedWorkspaceLabel = computed(() => {
    return this.workspaceOptions.find(
      (option) => option.value === this.selectedWorkspace(),
    )?.label;
  });
}
