/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-6`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection6PlanFeature = {
  feature: string;
  active: boolean;
};

type PricingSection6Plan = {
  name: string;
  price: string;
  description: string;
  features: PricingSection6PlanFeature[];
  isEnterprise: boolean;
  isRecommended: boolean;
  buttonText: string;
  buttonLink: string;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-6',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatDivider,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatCardActions,
  ],
  templateUrl: './pricing-section-6.component.html',
})
export class PricingSection6Component {
  plans: PricingSection6Plan[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'For small teams',
      features: [
        {
          feature: '10 user seats',
          active: true,
        },
        {
          feature: '5 workspaces',
          active: true,
        },
        {
          feature: 'Single Sign-On (SSO)',
          active: false,
        },
        {
          feature: 'Two-factor authentication',
          active: false,
        },
        {
          feature: 'Caching and pre-aggreation',
          active: false,
        },
      ],
      isEnterprise: false,
      isRecommended: false,
      buttonText: 'Get started',
      buttonLink: '#',
    },
    {
      name: 'Starter',
      price: '$50',
      description: 'For growing teams',
      features: [
        {
          feature: '50 user seats',
          active: true,
        },
        {
          feature: '25 workspaces',
          active: true,
        },
        {
          feature: 'Single Sign-On (SSO)',
          active: false,
        },
        {
          feature: 'Two-factor authentication',
          active: false,
        },
        {
          feature: 'Caching and pre-aggreation',
          active: false,
        },
      ],
      isEnterprise: false,
      isRecommended: true,
      buttonText: 'Get started',
      buttonLink: '#',
    },
    {
      name: 'Enterprise',
      price: '$190',
      description: 'For custom needs',
      features: [
        {
          feature: 'Unlimited user seats',
          active: true,
        },
        {
          feature: 'Unlimited workspaces',
          active: true,
        },
        {
          feature: 'Single Sign-On (SSO)',
          active: true,
        },
        {
          feature: 'Two-factor authentication',
          active: true,
        },
        {
          feature: 'Caching and pre-aggreation',
          active: true,
        },
      ],
      isEnterprise: true,
      isRecommended: false,
      buttonText: 'Contact sales',
      buttonLink: '#',
    },
  ];
}
