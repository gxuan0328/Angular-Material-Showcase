/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-8`
*/

import { Component, computed } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

type PricingSection8Plan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  featured: boolean;
  features: string[];
};

type PricingSection8ComparisonRow = {
  feature: string;
  category?: string;
  isCategory?: boolean;
  [key: string]: string | boolean | undefined;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-8',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatTableModule,
  ],
  templateUrl: './pricing-section-8.component.html',
})
export class PricingSection8Component {
  plans: PricingSection8Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description:
        'Ideal for freelancers and creative professionals starting out.',
      price: '$19',
      period: 'month',
      featured: false,
      features: [
        '5 active projects',
        '25GB cloud storage',
        'Basic reporting dashboard',
        'Community support',
        'Standard templates',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Perfect for expanding teams and growing businesses.',
      price: '$59',
      period: 'month',
      featured: true,
      features: [
        '50 active projects',
        '500GB cloud storage',
        'Advanced analytics suite',
        'Priority email support',
        'Premium templates library',
        'Team collaboration tools',
        'Custom branding options',
      ],
    },
    {
      id: 'scale',
      name: 'Scale',
      description: 'Enterprise-grade solution for large organizations.',
      price: '$149',
      period: 'month',
      featured: false,
      features: [
        'Unlimited projects',
        '2TB cloud storage',
        'Advanced security controls',
        'Dedicated success manager',
        'White-label solutions',
        'API access & webhooks',
        'Custom integrations',
        'SLA guarantees',
      ],
    },
  ];

  displayedColumns = ['feature', 'starter', 'growth', 'scale'];

  private comparisonFeatures: PricingSection8ComparisonRow[] = [
    // Project Management
    {
      feature: 'Project Management',
      isCategory: true,
      category: 'Project Management',
    },
    {
      feature: 'Active projects',
      starter: '5',
      growth: '50',
      scale: 'Unlimited',
    },
    {
      feature: 'Cloud storage',
      starter: '25GB',
      growth: '500GB',
      scale: '2TB',
    },
    {
      feature: 'Template library',
      starter: 'Standard',
      growth: 'Premium',
      scale: 'Custom',
    },
    {
      feature: 'File version history',
      starter: '30 days',
      growth: '1 year',
      scale: 'Unlimited',
    },
    { feature: 'Project archiving', starter: false, growth: true, scale: true },

    // Analytics & Insights
    {
      feature: 'Analytics & Insights',
      isCategory: true,
      category: 'Analytics & Insights',
    },
    { feature: 'Basic reporting', starter: true, growth: true, scale: true },
    {
      feature: 'Advanced analytics',
      starter: false,
      growth: true,
      scale: true,
    },
    { feature: 'Custom dashboards', starter: false, growth: true, scale: true },
    { feature: 'Real-time metrics', starter: false, growth: true, scale: true },
    {
      feature: 'Export capabilities',
      starter: 'PDF',
      growth: 'PDF, Excel',
      scale: 'All formats',
    },

    // Collaboration & Support
    {
      feature: 'Collaboration & Support',
      isCategory: true,
      category: 'Collaboration & Support',
    },
    {
      feature: 'Team collaboration',
      starter: false,
      growth: true,
      scale: true,
    },
    {
      feature: 'Support channel',
      starter: 'Community',
      growth: 'Email',
      scale: 'Dedicated manager',
    },
    {
      feature: 'Response time',
      starter: '48hrs',
      growth: '24hrs',
      scale: '4hrs',
    },
    { feature: 'Custom branding', starter: false, growth: true, scale: true },
    {
      feature: 'White-label options',
      starter: false,
      growth: false,
      scale: true,
    },

    // Security & Integrations
    {
      feature: 'Security & Integrations',
      isCategory: true,
      category: 'Security & Integrations',
    },
    { feature: 'SSL encryption', starter: true, growth: true, scale: true },
    { feature: 'Two-factor auth', starter: false, growth: true, scale: true },
    {
      feature: 'Advanced security',
      starter: false,
      growth: false,
      scale: true,
    },
    {
      feature: 'API access',
      starter: false,
      growth: 'Limited',
      scale: 'Full access',
    },
    { feature: 'Webhooks', starter: false, growth: true, scale: true },
    { feature: 'SLA guarantee', starter: false, growth: false, scale: '99.9%' },
  ];

  comparisonData = computed<PricingSection8ComparisonRow[]>(
    () => this.comparisonFeatures,
  );

  isCategoryRow(index: number, row: PricingSection8ComparisonRow): boolean {
    return row.isCategory === true;
  }
}
