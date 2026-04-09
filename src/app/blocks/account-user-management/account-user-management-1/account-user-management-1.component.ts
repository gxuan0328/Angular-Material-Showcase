/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-1`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';

interface Tab {
  id: string;
  label: string;
}

interface BillingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

@Component({
  selector: 'ngm-dev-block-account-user-management-1',
  templateUrl: './account-user-management-1.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgClass,
    MatSlideToggleModule,
  ],
})
export class AccountUserManagement1Component {
  tabs: Tab[] = [
    { id: 'account', label: 'Account details' },
    { id: 'workspaces', label: 'Workspaces' },
    { id: 'billing', label: 'Billing' },
  ];

  billingPlans: BillingPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0/month',
      features: ['Up to 5 users', 'Basic analytics', 'Community support'],
      current: false,
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$49/month',
      features: [
        'Up to 20 users',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
      ],
      current: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '$199/month',
      features: [
        'Unlimited users',
        'Enterprise analytics',
        '24/7 dedicated support',
        'Custom solutions',
        'SLA guarantees',
      ],
      current: false,
    },
  ];

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  workspaceForm = new FormGroup({
    betaFeatures: new FormControl(false),
    testMode: new FormControl(false),
  });

  billingForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required]),
    expiryDate: new FormControl('', [Validators.required]),
    cvc: new FormControl('', [Validators.required]),
  });

  showCurrentPassword = false;
  showNewPassword = false;

  togglePasswordVisibility(field: 'current' | 'new'): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else {
      this.showNewPassword = !this.showNewPassword;
    }
  }

  updateEmail(): void {
    if (this.emailForm.valid) {
      console.log('Update email:', this.emailForm.value);
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      console.log('Update password:', this.passwordForm.value);
    }
  }

  saveWorkspaceSettings(): void {
    if (this.workspaceForm.valid) {
      console.log('Save workspace settings:', this.workspaceForm.value);
    }
  }

  resetWorkspaceSettings(): void {
    this.workspaceForm.reset();
  }

  updateBillingInfo(): void {
    if (this.billingForm.valid) {
      console.log('Update billing info:', this.billingForm.value);
    }
  }

  changePlan(planId: string): void {
    console.log('Change to plan:', planId);
  }
}
