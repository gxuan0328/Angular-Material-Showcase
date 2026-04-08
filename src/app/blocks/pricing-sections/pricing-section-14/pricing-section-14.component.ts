/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-14`
*/

import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection14Feature = {
  id: string;
  name: string;
  description?: string;
  included: boolean;
};

type PricingSection14AdditionalInfo = {
  title: string;
  description: string;
};

type PricingSection14Plan = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  period: string;
  priceNote?: string;
  cta: string;
  icon: string;
  featuresTitle: string;
  features: PricingSection14Feature[];
  additionalInfo?: PricingSection14AdditionalInfo;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-14',
  imports: [
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardAvatar,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
  ],
  templateUrl: './pricing-section-14.component.html',
})
export class PricingSection14Component {
  plans: PricingSection14Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      shortDescription: 'Perfect for individuals',
      description:
        'Essential tools for solo entrepreneurs and freelancers getting started.',
      price: '$12',
      period: '/month',
      priceNote: 'Billed monthly, cancel anytime',
      cta: 'Start with Basic',
      icon: 'person',
      featuresTitle: 'Basic features include:',
      features: [
        {
          id: 'projects',
          name: '3 active projects',
          description: 'Manage up to 3 concurrent projects',
          included: true,
        },
        {
          id: 'storage',
          name: '5GB cloud storage',
          description: 'Secure cloud storage for your files',
          included: true,
        },
        {
          id: 'support',
          name: 'Email support',
          description: '48-hour response time',
          included: true,
        },
        {
          id: 'templates',
          name: 'Basic templates',
          description: 'Access to standard templates',
          included: true,
        },
        {
          id: 'analytics',
          name: 'Basic analytics',
          description: 'Simple project insights',
          included: true,
        },
        {
          id: 'integrations',
          name: 'Advanced integrations',
          description: 'Connect with third-party tools',
          included: false,
        },
        {
          id: 'priority',
          name: 'Priority support',
          description: 'Faster response times',
          included: false,
        },
        {
          id: 'custom',
          name: 'Custom branding',
          description: 'White-label options',
          included: false,
        },
      ],
      additionalInfo: {
        title: 'Great for getting started',
        description:
          'The Basic plan provides everything you need to start managing your projects efficiently with essential tools and reliable support.',
      },
    },
    {
      id: 'professional',
      name: 'Professional',
      shortDescription: 'For growing teams',
      description:
        'Advanced features and tools designed for expanding businesses and collaborative teams.',
      price: '$39',
      period: '/month',
      priceNote: 'Most popular choice for teams',
      cta: 'Upgrade to Professional',
      icon: 'groups',
      featuresTitle: 'Everything in Basic, plus:',
      features: [
        {
          id: 'projects',
          name: 'Unlimited projects',
          description: 'No limits on active projects',
          included: true,
        },
        {
          id: 'storage',
          name: '100GB cloud storage',
          description: 'Expanded storage capacity',
          included: true,
        },
        {
          id: 'support',
          name: 'Priority email support',
          description: '24-hour response time',
          included: true,
        },
        {
          id: 'templates',
          name: 'Premium templates',
          description: 'Access to premium design templates',
          included: true,
        },
        {
          id: 'analytics',
          name: 'Advanced analytics',
          description: 'Detailed insights and reporting',
          included: true,
        },
        {
          id: 'integrations',
          name: 'Advanced integrations',
          description: 'Connect with 100+ tools',
          included: true,
        },
        {
          id: 'collaboration',
          name: 'Team collaboration',
          description: 'Real-time team features',
          included: true,
        },
        {
          id: 'custom',
          name: 'Custom branding',
          description: 'Basic white-label options',
          included: false,
        },
      ],
      additionalInfo: {
        title: 'Perfect for growing teams',
        description:
          'Professional plan scales with your business needs, offering enhanced collaboration tools and priority support for productive teamwork.',
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      shortDescription: 'For large organizations',
      description:
        'Comprehensive solution with enterprise-grade security and dedicated support for large organizations.',
      price: '$99',
      period: '/month',
      priceNote: 'Custom pricing available for 100+ users',
      cta: 'Contact Enterprise Sales',
      icon: 'business',
      featuresTitle: 'Everything in Professional, plus:',
      features: [
        {
          id: 'projects',
          name: 'Unlimited everything',
          description: 'No restrictions on any features',
          included: true,
        },
        {
          id: 'storage',
          name: 'Unlimited storage',
          description: 'Unlimited secure cloud storage',
          included: true,
        },
        {
          id: 'support',
          name: 'Dedicated support manager',
          description: 'Personal account manager',
          included: true,
        },
        {
          id: 'templates',
          name: 'Custom templates',
          description: 'Bespoke template creation',
          included: true,
        },
        {
          id: 'analytics',
          name: 'Enterprise analytics',
          description: 'Custom reporting and dashboards',
          included: true,
        },
        {
          id: 'integrations',
          name: 'Custom integrations',
          description: 'API access and custom builds',
          included: true,
        },
        {
          id: 'collaboration',
          name: 'Advanced collaboration',
          description: 'Enterprise team features',
          included: true,
        },
        {
          id: 'custom',
          name: 'Full white-label',
          description: 'Complete branding customization',
          included: true,
        },
      ],
      additionalInfo: {
        title: 'Enterprise-grade solution',
        description:
          'Our Enterprise plan provides the highest level of security, customization, and support for mission-critical business operations.',
      },
    },
    {
      id: 'startup',
      name: 'Startup',
      shortDescription: 'Special pricing for startups',
      description:
        'Discounted Professional features for qualified startups and early-stage companies.',
      price: '$19',
      period: '/month',
      priceNote: 'Must qualify as startup (< 2 years old)',
      cta: 'Apply for Startup Plan',
      icon: 'rocket_launch',
      featuresTitle: 'Professional features at startup pricing:',
      features: [
        {
          id: 'projects',
          name: '10 active projects',
          description: 'Perfect for startup project management',
          included: true,
        },
        {
          id: 'storage',
          name: '50GB cloud storage',
          description: 'Adequate storage for growing teams',
          included: true,
        },
        {
          id: 'support',
          name: 'Priority email support',
          description: '24-hour response time',
          included: true,
        },
        {
          id: 'templates',
          name: 'Premium templates',
          description: 'Professional template library',
          included: true,
        },
        {
          id: 'analytics',
          name: 'Advanced analytics',
          description: 'Growth-focused insights',
          included: true,
        },
        {
          id: 'integrations',
          name: 'Key integrations',
          description: 'Essential third-party connections',
          included: true,
        },
        {
          id: 'collaboration',
          name: 'Team collaboration',
          description: 'Built for small teams',
          included: true,
        },
        {
          id: 'custom',
          name: 'Basic branding',
          description: 'Limited customization options',
          included: true,
        },
      ],
      additionalInfo: {
        title: 'Supporting innovation',
        description:
          'Our Startup plan helps early-stage companies access professional tools at affordable pricing, with the option to scale as you grow.',
      },
    },
  ];

  selectedPlan = signal<PricingSection14Plan>(this.plans[1]); // Default to Professional

  selectPlan(plan: PricingSection14Plan): void {
    this.selectedPlan.set(plan);
  }
}
