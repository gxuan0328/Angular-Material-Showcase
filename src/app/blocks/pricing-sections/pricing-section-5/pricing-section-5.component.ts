/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-5`
*/

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection5Frequency = {
  value: string;
  label: string;
  priceSuffix: string;
};

type PricingSection5Plan = {
  name: string;
  price: string | { monthly: string; annually: string };
  description: string;
  features: string[];
  isEnterprise: boolean;
  isRecommended: boolean;
  buttonText: string;
  buttonLink: string;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-5',
  imports: [
    FormsModule,
    MatButton,
    MatButtonToggleModule,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatCardActions,
  ],
  templateUrl: './pricing-section-5.component.html',
})
export class PricingSection5Component {
  frequencies: PricingSection5Frequency[] = [
    { value: 'monthly', label: 'Monthly', priceSuffix: '/mo' },
    { value: 'annually', label: 'Annually', priceSuffix: '/year' },
  ];

  plans: PricingSection5Plan[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'For small teams',
      features: [
        'Unlimited members',
        '5 workspaces',
        'Community Slack Support',
      ],
      isEnterprise: false,
      isRecommended: false,
      buttonText: 'Get started',
      buttonLink: '#',
    },
    {
      name: 'Starter',
      price: { monthly: '$50', annually: '$490' },
      description: 'For growing teams',
      features: [
        'Unlimited members',
        '10 workspaces',
        'Community Slack Support',
      ],
      isEnterprise: false,
      isRecommended: true,
      buttonText: 'Get started',
      buttonLink: '#',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For custom needs',
      features: [
        'Unlimited members',
        'Unlimited workspaces',
        'Priority Support',
        'Single Sign-On (SSO)',
        '90 days of history',
      ],
      isEnterprise: true,
      isRecommended: false,
      buttonText: 'Contact sales',
      buttonLink: '#',
    },
  ];

  frequency = this.frequencies[0];

  handleFrequencyChange(selectedFrequency: PricingSection5Frequency): void {
    this.frequency = selectedFrequency;
  }

  getPlanPrice(plan: PricingSection5Plan): string {
    if (plan.isRecommended && typeof plan.price === 'object') {
      return plan.price[this.frequency.value as keyof typeof plan.price];
    }
    return plan.price as string;
  }
}
