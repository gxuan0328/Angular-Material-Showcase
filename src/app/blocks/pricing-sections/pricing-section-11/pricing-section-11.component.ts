/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-11`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection11Plan = {
  id: string;
  name: string;
  description: string;
  price: string;
  note?: string;
  cta: string;
  recommended: boolean;
  featuresTitle: string;
  features: string[];
};

@Component({
  selector: 'ngm-dev-block-pricing-section-11',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatDivider,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
  ],
  templateUrl: './pricing-section-11.component.html',
})
export class PricingSection11Component {
  plans: PricingSection11Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description:
        'Perfect for individuals and small projects just getting started.',
      price: 'Free',
      note: 'No credit card required',
      cta: 'Get started for free',
      recommended: false,
      featuresTitle: 'Everything you need to start',
      features: [
        '3 projects',
        '5GB storage',
        'Community support',
        'Basic templates',
        'Mobile app access',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Advanced features for growing teams and businesses.',
      price: '$29',
      cta: 'Start professional trial',
      recommended: true,
      featuresTitle: 'Everything in Starter, plus',
      features: [
        'Unlimited projects',
        '100GB storage',
        'Priority support',
        'Advanced analytics',
        'Team collaboration',
        'Custom branding',
        'Integrations',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Comprehensive solution for established companies.',
      price: '$89',
      cta: 'Upgrade to business',
      recommended: false,
      featuresTitle: 'Everything in Professional, plus',
      features: [
        '500GB storage',
        'Advanced security',
        'Custom workflows',
        'API access',
        'Dedicated support',
        'Training sessions',
        'SLA guarantees',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description:
        'Tailored solutions for large organizations with specific needs.',
      price: 'Custom',
      note: 'Contact for pricing',
      cta: 'Contact sales',
      recommended: false,
      featuresTitle: 'Everything in Business, plus',
      features: [
        'Unlimited storage',
        'Custom integrations',
        'On-premise deployment',
        'Dedicated success manager',
        'Custom onboarding',
        'Advanced compliance',
        'White-label solutions',
      ],
    },
  ];
}
