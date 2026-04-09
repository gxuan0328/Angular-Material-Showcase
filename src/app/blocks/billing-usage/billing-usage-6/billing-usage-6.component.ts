/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update billing-usage/billing-usage-6`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

interface BillingItem {
  name: string;
  description: string;
  used: string;
  included: string;
  price: number;
  percentage?: number;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
}

@Component({
  selector: 'ngm-dev-block-billing-usage-6',
  templateUrl: './billing-usage-6.component.html',
  styleUrls: ['./billing-usage-6.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
})
export class BillingUsage6Component {
  tabs = [
    { id: 'account', label: 'Account details' },
    { id: 'settings', label: 'Settings' },
    { id: 'billing', label: 'Billing' },
  ];

  billingItems: BillingItem[] = [
    {
      name: 'Starter plan',
      description: 'Discounted plan for start-ups and growing companies',
      used: '',
      included: '',
      price: 90,
    },
    {
      name: 'Storage',
      description: '',
      used: '10.1 GB',
      included: '100 GB included',
      price: 40,
      percentage: 10.1,
    },
    {
      name: 'Bandwidth',
      description: '',
      used: '2.9 GB',
      included: '5 GB included',
      price: 10,
      percentage: 58,
    },
    {
      name: 'Users',
      description: '',
      used: '9',
      included: '50 users included',
      price: 20,
      percentage: 18,
    },
    {
      name: 'Query super caching (EU-Central 1)',
      description: '4 GB query cache, $120/mo',
      used: '',
      included: '',
      price: 120,
    },
  ];

  addOns: AddOn[] = [
    {
      id: 'advanced-bot-protection',
      name: 'Advanced bot protection',
      description:
        'Safeguard your assets with our cutting-edge bot protection. Our AI solution identifies and mitigates automated traffic to protect your workspace from bad bots.',
      price: '$25/month',
      isActive: false,
    },
    {
      id: 'workspace-insights',
      name: 'Workspace insights',
      description:
        "Real-time analysis of your workspace's usage, enabling you to make well-informed decisions for optimization.",
      price: '$50/month',
      isActive: false,
    },
  ];

  showFreePlanBanner = true;

  dismissFreePlanBanner(): void {
    this.showFreePlanBanner = false;
  }

  spendingForm = new FormGroup({
    amount: new FormControl('350'),
    email: new FormControl('admin@company.com'),
    enabled: new FormControl(true),
  });

  onSubmit() {
    if (this.spendingForm.valid) {
      console.log(this.spendingForm.value);
    }
  }

  getTotalPrice(): number {
    return this.billingItems.reduce((sum, item) => sum + item.price, 0);
  }

  toggleAddOn(addOnId: string): void {
    this.addOns = this.addOns.map((addon) =>
      addon.id === addOnId ? { ...addon, isActive: !addon.isActive } : addon,
    );
  }
}
