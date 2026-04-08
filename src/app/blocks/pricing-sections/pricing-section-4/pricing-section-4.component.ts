/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-4`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection4Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  isEnterprise: boolean;
  isRecommended: boolean;
  buttonText: string;
  buttonLink: string;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-4',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
  templateUrl: './pricing-section-4.component.html',
})
export class PricingSection4Component {
  plans: PricingSection4Plan[] = [
    {
      name: 'Hobby',
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
      name: 'Growth',
      price: '$50',
      description: 'For scaling teams',
      features: ['Unlimited members', '10 workspaces', 'Email support'],
      isEnterprise: false,
      isRecommended: true,
      buttonText: 'Try for free',
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
}
