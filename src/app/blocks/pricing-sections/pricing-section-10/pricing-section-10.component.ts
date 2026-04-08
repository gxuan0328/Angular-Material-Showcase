/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-10`
*/

import { Component, model, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

type PricingSection10Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  cta: string;
  featured: boolean;
  features: string[];
};

@Component({
  selector: 'ngm-dev-block-pricing-section-10',
  imports: [
    MatButton,
    MatButtonToggleModule,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    FormsModule,
  ],
  templateUrl: './pricing-section-10.component.html',
})
export class PricingSection10Component {
  isAnnual = model(false);

  plans: PricingSection10Plan[] = [
    {
      id: 'essential',
      name: 'Essential',
      description:
        'Perfect for small businesses and startups getting their feet wet.',
      monthlyPrice: '$29',
      annualPrice: '$279',
      cta: 'Start your journey',
      featured: false,
      features: [
        'Up to 5 team members',
        '50GB secure storage',
        'Basic project templates',
        'Email notifications',
        'Mobile app access',
        'Community support',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description:
        'Advanced tools and features for growing companies and teams.',
      monthlyPrice: '$79',
      annualPrice: '$759',
      cta: 'Unlock full potential',
      featured: true,
      features: [
        'Up to 25 team members',
        '500GB secure storage',
        'Advanced project templates',
        'Real-time notifications',
        'Priority email support',
        'Advanced analytics',
        'Custom integrations',
        'Team collaboration tools',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description:
        'Comprehensive solution for large organizations with complex needs.',
      monthlyPrice: '$199',
      annualPrice: '$1,909',
      cta: 'Contact sales',
      featured: false,
      features: [
        'Unlimited team members',
        'Unlimited secure storage',
        'Custom templates & branding',
        'Multi-channel notifications',
        'Dedicated success manager',
        'Advanced security & compliance',
        'Custom API integrations',
        'On-premise deployment',
        'SLA guarantees',
      ],
    },
  ];

  getCurrentPrice(plan: PricingSection10Plan): string {
    return this.isAnnual() ? plan.annualPrice : plan.monthlyPrice;
  }

  getSavings(plan: PricingSection10Plan): number {
    const monthlyYearly =
      parseFloat(plan.monthlyPrice.replace('$', '').replace(',', '')) * 12;
    const annual = parseFloat(
      plan.annualPrice.replace('$', '').replace(',', ''),
    );
    return Math.round(((monthlyYearly - annual) / monthlyYearly) * 100);
  }
}
