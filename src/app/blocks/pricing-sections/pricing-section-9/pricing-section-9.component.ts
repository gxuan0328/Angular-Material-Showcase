/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-9`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection9Tier = {
  id: string;
  name: string;
  description: string;
  priceMonthly: string;
  cta: string;
  mostPopular: boolean;
  features: string[];
};

@Component({
  selector: 'ngm-dev-block-pricing-section-9',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
  ],
  templateUrl: './pricing-section-9.component.html',
})
export class PricingSection9Component {
  tiers: PricingSection9Tier[] = [
    {
      id: 'freelancer',
      name: 'Freelancer',
      description:
        'Perfect for individual creators and consultants building their brand.',
      priceMonthly: '$15',
      cta: 'Start building',
      mostPopular: false,
      features: [
        '3 active campaigns',
        '1,000 contacts',
        'Email automation',
        'Basic templates',
        'Analytics dashboard',
        'Community support',
      ],
    },
    {
      id: 'studio',
      name: 'Studio',
      description:
        'Ideal for creative agencies and growing teams with advanced needs.',
      priceMonthly: '$49',
      cta: 'Scale your business',
      mostPopular: true,
      features: [
        '25 active campaigns',
        '10,000 contacts',
        'Advanced automation',
        'Premium templates',
        'A/B testing',
        'Priority support',
        'Custom branding',
        'Team collaboration',
        'Advanced analytics',
      ],
    },
    {
      id: 'agency',
      name: 'Agency',
      description:
        'Enterprise solution for large agencies managing multiple client accounts.',
      priceMonthly: '$129',
      cta: 'Go enterprise',
      mostPopular: false,
      features: [
        'Unlimited campaigns',
        '100,000 contacts',
        'Multi-account management',
        'White-label solutions',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced reporting',
        'Custom onboarding',
        'SLA guarantee',
        'Phone support',
      ],
    },
  ];
}
