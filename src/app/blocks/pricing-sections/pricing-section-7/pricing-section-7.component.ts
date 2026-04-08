/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-7`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection7Tier = {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  description: string;
  features: string[];
  featured: boolean;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-7',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatCardActions,
  ],
  templateUrl: './pricing-section-7.component.html',
})
export class PricingSection7Component {
  tiers: PricingSection7Tier[] = [
    {
      name: 'Starter',
      id: 'tier-starter',
      href: '#',
      priceMonthly: '$19',
      description:
        'Perfect for freelancers and small projects getting started.',
      features: [
        '15 active projects',
        'Up to 5,000 API calls',
        'Basic analytics dashboard',
        '48-hour support response',
        'Community access',
      ],
      featured: false,
    },
    {
      name: 'Professional',
      id: 'tier-professional',
      href: '#',
      priceMonthly: '$79',
      description:
        'Advanced features and priority support for growing businesses.',
      features: [
        'Unlimited projects',
        'Unlimited API calls',
        'Advanced analytics & insights',
        'Priority support team',
        'Custom integrations',
        'Advanced security features',
        'White-label options',
      ],
      featured: true,
    },
  ];

  getCardClasses(tier: PricingSection7Tier, index: number): string {
    const baseClasses = 'ring-1! ring-outline-variant!';

    if (tier.featured) {
      return `${baseClasses} relative bg-surface-container-highest!`;
    }

    const positionClasses =
      index === 0
        ? 'lg:rounded-r-none!'
        : 'sm:rounded-t-none! lg:rounded-bl-none!';

    return `${baseClasses} bg-surface-container! ${positionClasses}`;
  }
}
