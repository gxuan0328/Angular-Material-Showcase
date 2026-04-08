/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-15`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection15Plan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  cta: string;
  featured: boolean;
  badge?: string;
  icon: string;
  featuresTitle: string;
  features: string[];
};

@Component({
  selector: 'ngm-dev-block-pricing-section-15',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
  ],
  templateUrl: './pricing-section-15.component.html',
})
export class PricingSection15Component {
  plans: PricingSection15Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description:
        'Perfect for individuals and small projects just getting started.',
      price: 'Free',
      period: 'Forever',
      cta: 'Get started for free',
      featured: false,
      icon: 'play_circle',
      featuresTitle: "What's included:",
      features: [
        'Up to 3 projects',
        '5GB storage space',
        'Basic templates',
        'Community support',
        'Mobile app access',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description:
        'Advanced tools and features for growing teams and businesses.',
      price: '$29',
      period: 'per month',
      cta: 'Start 14-day trial',
      featured: true,
      badge: 'Most Popular',
      icon: 'business_center',
      featuresTitle: 'Everything in Starter, plus:',
      features: [
        'Unlimited projects',
        '100GB storage space',
        'Premium templates',
        'Priority email support',
        'Advanced analytics',
        'Team collaboration',
        'Custom branding',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description:
        'Tailored solutions for large organizations with specific needs.',
      price: 'Custom',
      period: 'Contact us',
      cta: 'Contact sales',
      featured: false,
      icon: 'domain',
      featuresTitle: 'Everything in Professional, plus:',
      features: [
        'Unlimited everything',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees',
        'On-premise deployment',
        'Advanced security',
        'Training & onboarding',
      ],
    },
  ];
}
