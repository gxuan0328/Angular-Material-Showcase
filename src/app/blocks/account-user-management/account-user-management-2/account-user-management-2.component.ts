/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-2`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

interface Tab {
  id: string;
  label: string;
}

interface Model {
  id: string;
  name: string;
}

interface AddOn {
  id: string;
  name: string;
  price: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'ngm-dev-block-account-user-management-2',
  templateUrl: './account-user-management-2.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
  ],
})
export class AccountUserManagement2Component {
  tabs: Tab[] = [
    { id: 'settings', label: 'Settings' },
    { id: 'add-ons', label: 'Add-Ons' },
  ];

  models: Model[] = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5', name: 'GPT-3.5' },
    { id: 'claude-2', name: 'Claude 2' },
  ];

  addOns: AddOn[] = [
    {
      id: 'query-caching',
      name: 'Query Caching',
      price: '$25/month',
      description:
        'Optimize performance and reduce latency with intelligent query caching for faster data retrieval.',
      isActive: false,
    },
    {
      id: 'bot-protection',
      name: 'Advanced Bot Protection',
      price: '$100/month',
      description:
        'Enhanced security measures to protect your application from sophisticated bot attacks and threats.',
      isActive: true,
    },
    {
      id: 'observability',
      name: 'Observability Analytics',
      price: '$90/month',
      description:
        'Comprehensive monitoring and analytics tools for deep insights into your application performance.',
      isActive: false,
    },
  ];

  workspaceForm = new FormGroup({
    name: new FormControl('Analytics Workspace', [Validators.required]),
    defaultModel: new FormControl('gpt-4', [Validators.required]),
    trainingCycle: new FormControl('weekly', [Validators.required]),
    requireApproval: new FormControl(true),
    enableAuditLogs: new FormControl(false),
    enableEmailNotifications: new FormControl(true),
  });

  showFreePlanBanner = true;

  dismissFreePlanBanner(): void {
    this.showFreePlanBanner = false;
  }

  saveSettings(): void {
    if (this.workspaceForm.valid) {
      console.log('Save settings:', this.workspaceForm.value);
    }
  }

  resetSettings(): void {
    this.workspaceForm.reset({
      name: 'Analytics Workspace',
      defaultModel: 'gpt-4',
      trainingCycle: 'weekly',
      requireApproval: true,
      enableAuditLogs: false,
      enableEmailNotifications: true,
    });
  }

  toggleAddOn(addOnId: string): void {
    this.addOns = this.addOns.map((addon) =>
      addon.id === addOnId ? { ...addon, isActive: !addon.isActive } : addon,
    );
  }
}
