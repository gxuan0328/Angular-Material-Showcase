/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update form-layouts/form-layout-6`
*/

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';

type Plan = {
  name: string;
  features: { feature: string }[];
  price: string;
  href: string;
  isRecommended: boolean;
};

type Highlight = {
  id: number;
  feature: string;
};

@Component({
  selector: 'ngm-dev-block-form-layout-6',
  templateUrl: './form-layout-6.component.html',
  styleUrls: ['./form-layout-6.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    MatCardModule,
  ],
})
export class FormLayout6Component {
  private _fb = inject(FormBuilder);

  highlights: Highlight[] = [
    {
      id: 1,
      feature: 'Used by 50% of S&P 500 companies',
    },
    {
      id: 2,
      feature: 'Based on open-source tech',
    },
    {
      id: 3,
      feature: 'Largest developer community',
    },
  ];

  plans: Plan[] = [
    {
      name: 'Hobby',
      features: [
        { feature: '1,000 requests per day' },
        { feature: '3 environments' },
        { feature: 'Up to 10 user seats' },
        { feature: 'Community support' },
      ],
      price: '$40',
      href: '#',
      isRecommended: false,
    },
    {
      name: 'Premium',
      features: [
        { feature: '100,000 requests per day' },
        { feature: '10 environments' },
        { feature: 'Up to 50 user seats' },
        { feature: 'Premium Slack support' },
      ],
      price: '$80',
      href: '#',
      isRecommended: true,
    },
    {
      name: 'Enterprise',
      features: [
        { feature: 'Unlimited requests per day' },
        { feature: 'Unlimited environments and user seats' },
        { feature: 'SAML Single-Sign-On (SSO)' },
        { feature: '99.99% SLA' },
        { feature: 'Volume discount' },
      ],
      price: '$160',
      href: '#',
      isRecommended: false,
    },
  ];

  selectedPlan = signal<Plan>(this.plans[0]);

  form = this._fb.group({
    organization: [''],
    workspace: ['', Validators.required],
    region: ['1'],
    plan: [this.selectedPlan()],
  });

  setSelectedPlan(plan: Plan): void {
    this.selectedPlan.set(plan);
    this.form.get('plan')?.setValue(plan);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    }
  }

  onCancel(): void {
    console.log('Cancel clicked');
  }
}
