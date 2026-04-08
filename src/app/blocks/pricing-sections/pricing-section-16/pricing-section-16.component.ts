/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-16`
*/

import { Component, computed } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

type PricingSection16Plan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  cta: string;
  featured: boolean;
  badge?: string;
};

type PricingSection16ComparisonRow = {
  feature: string;
  category?: string;
  isCategory?: boolean;
  [key: string]: string | boolean | undefined;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-16',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatIcon,
    MatTableModule,
  ],
  templateUrl: './pricing-section-16.component.html',
})
export class PricingSection16Component {
  plans: PricingSection16Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description:
        'Essential features for individuals and small teams getting started.',
      price: 'Free',
      period: 'Forever',
      cta: 'Get started free',
      featured: false,
    },
    {
      id: 'pro',
      name: 'Professional',
      description:
        'Advanced tools and features for growing businesses and teams.',
      price: '$49',
      period: 'per month',
      cta: 'Start 14-day trial',
      featured: true,
      badge: 'Most Popular',
    },
    {
      id: 'business',
      name: 'Business',
      description:
        'Comprehensive solution for established companies and large teams.',
      price: '$149',
      period: 'per month',
      cta: 'Upgrade to Business',
      featured: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description:
        'Custom solutions with dedicated support for large organizations.',
      price: 'Custom',
      period: 'Contact us',
      cta: 'Contact sales',
      featured: false,
    },
  ];

  displayedColumns = ['feature', 'basic', 'pro', 'business', 'enterprise'];

  private comparisonFeatures: PricingSection16ComparisonRow[] = [
    // Core Features
    { feature: 'Core Features', isCategory: true, category: 'Core Features' },
    {
      feature: 'Projects',
      basic: '3',
      pro: '50',
      business: 'Unlimited',
      enterprise: 'Unlimited',
    },
    {
      feature: 'Storage space',
      basic: '1GB',
      pro: '100GB',
      business: '1TB',
      enterprise: 'Unlimited',
    },
    {
      feature: 'Team members',
      basic: '1',
      pro: '10',
      business: '50',
      enterprise: 'Unlimited',
    },
    {
      feature: 'File uploads',
      basic: '10MB',
      pro: '100MB',
      business: '1GB',
      enterprise: 'Unlimited',
    },
    {
      feature: 'API calls per month',
      basic: '1,000',
      pro: '50,000',
      business: '500,000',
      enterprise: 'Unlimited',
    },

    // Collaboration & Sharing
    {
      feature: 'Collaboration & Sharing',
      isCategory: true,
      category: 'Collaboration & Sharing',
    },
    {
      feature: 'Real-time collaboration',
      basic: false,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Advanced permissions',
      basic: false,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Guest access',
      basic: false,
      pro: '5 guests',
      business: '25 guests',
      enterprise: 'Unlimited',
    },
    {
      feature: 'Public sharing',
      basic: true,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Password protection',
      basic: false,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Expiration dates',
      basic: false,
      pro: true,
      business: true,
      enterprise: true,
    },

    // Analytics & Reporting
    {
      feature: 'Analytics & Reporting',
      isCategory: true,
      category: 'Analytics & Reporting',
    },
    {
      feature: 'Basic analytics',
      basic: true,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Advanced reports',
      basic: false,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Custom dashboards',
      basic: false,
      pro: false,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Data export',
      basic: 'CSV',
      pro: 'CSV, PDF',
      business: 'All formats',
      enterprise: 'All formats',
    },
    {
      feature: 'Real-time insights',
      basic: false,
      pro: false,
      business: true,
      enterprise: true,
    },

    // Security & Compliance
    {
      feature: 'Security & Compliance',
      isCategory: true,
      category: 'Security & Compliance',
    },
    {
      feature: 'SSL encryption',
      basic: true,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Two-factor authentication',
      basic: false,
      pro: true,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Advanced security',
      basic: false,
      pro: false,
      business: true,
      enterprise: true,
    },
    {
      feature: 'SAML SSO',
      basic: false,
      pro: false,
      business: false,
      enterprise: true,
    },
    {
      feature: 'Audit logs',
      basic: false,
      pro: false,
      business: true,
      enterprise: true,
    },
    {
      feature: 'Compliance certifications',
      basic: false,
      pro: false,
      business: 'SOC 2',
      enterprise: 'SOC 2, HIPAA',
    },

    // Support & Services
    {
      feature: 'Support & Services',
      isCategory: true,
      category: 'Support & Services',
    },
    {
      feature: 'Support channel',
      basic: 'Community',
      pro: 'Email',
      business: 'Email + Chat',
      enterprise: 'Dedicated manager',
    },
    {
      feature: 'Response time',
      basic: 'Best effort',
      pro: '24 hours',
      business: '4 hours',
      enterprise: '1 hour',
    },
    {
      feature: 'Onboarding assistance',
      basic: false,
      pro: 'Self-service',
      business: 'Guided setup',
      enterprise: 'White-glove',
    },
    {
      feature: 'Training resources',
      basic: 'Documentation',
      pro: 'Videos + Docs',
      business: 'Live training',
      enterprise: 'Custom training',
    },
    {
      feature: 'Account manager',
      basic: false,
      pro: false,
      business: false,
      enterprise: true,
    },

    // Integrations & API
    {
      feature: 'Integrations & API',
      isCategory: true,
      category: 'Integrations & API',
    },
    {
      feature: 'Pre-built integrations',
      basic: '5',
      pro: '50',
      business: '200+',
      enterprise: 'All + Custom',
    },
    {
      feature: 'Webhooks',
      basic: false,
      pro: '10',
      business: '100',
      enterprise: 'Unlimited',
    },
    {
      feature: 'API access',
      basic: 'Read-only',
      pro: 'Full access',
      business: 'Full access',
      enterprise: 'Full access',
    },
    {
      feature: 'Custom integrations',
      basic: false,
      pro: false,
      business: 'Limited',
      enterprise: 'Unlimited',
    },
    {
      feature: 'Rate limits',
      basic: '100/hour',
      pro: '1,000/hour',
      business: '10,000/hour',
      enterprise: 'Custom',
    },
  ];

  comparisonData = computed<PricingSection16ComparisonRow[]>(
    () => this.comparisonFeatures,
  );

  isCategoryRow(index: number, row: PricingSection16ComparisonRow): boolean {
    return row.isCategory === true;
  }
}
