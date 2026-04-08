/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-13`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection13Feature = {
  name: string;
  included: boolean;
};

type PricingSection13Plan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period?: string;
  priceNote?: string;
  cta: string;
  highlighted: boolean;
  badge?: string;
  icon: string;
  iconColor: string;
  featuresTitle: string;
  features: PricingSection13Feature[];
};

type PricingSection13AdditionalFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type PricingSection13FAQ = {
  id: string;
  question: string;
  answer: string;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-13',
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
  templateUrl: './pricing-section-13.component.html',
})
export class PricingSection13Component {
  plans: PricingSection13Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description:
        'Perfect for individuals and small teams just starting their journey.',
      price: 'Free',
      priceNote: 'forever',
      cta: 'Get started free',
      highlighted: false,
      icon: 'rocket_launch',
      iconColor: 'emerald-500',
      featuresTitle: 'Starter features',
      features: [
        { name: '5 projects', included: true },
        { name: '10GB storage', included: true },
        { name: 'Basic templates', included: true },
        { name: 'Community support', included: true },
        { name: 'Mobile app', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom integrations', included: false },
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description:
        'Advanced features for growing businesses and expanding teams.',
      price: '$49',
      period: '/month',
      cta: 'Start professional',
      highlighted: true,
      badge: 'Most Popular',
      icon: 'trending_up',
      iconColor: 'blue-500',
      featuresTitle: 'Everything in Starter, plus',
      features: [
        { name: 'Unlimited projects', included: true },
        { name: '1TB storage', included: true },
        { name: 'Premium templates', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Team collaboration', included: true },
        { name: 'Custom branding', included: true },
        { name: 'White-label options', included: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description:
        'Tailored solutions for large organizations with specific requirements.',
      price: 'Custom',
      priceNote: 'Contact for pricing',
      cta: 'Contact sales',
      highlighted: false,
      icon: 'business',
      iconColor: 'purple-500',
      featuresTitle: 'Everything in Professional, plus',
      features: [
        { name: 'Unlimited everything', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'White-label options', included: true },
        { name: 'On-premise deployment', included: true },
        { name: 'SLA guarantees', included: true },
        { name: 'Custom onboarding', included: true },
        { name: 'Compliance features', included: true },
      ],
    },
  ];

  additionalFeatures: PricingSection13AdditionalFeature[] = [
    {
      id: 'security',
      title: 'Enterprise Security',
      description:
        'Bank-level encryption and security measures to protect your data and ensure compliance.',
      icon: 'security',
    },
    {
      id: 'integrations',
      title: 'Seamless Integrations',
      description:
        'Connect with your favorite tools and services through our extensive integration library.',
      icon: 'integration_instructions',
    },
    {
      id: 'support',
      title: '24/7 Expert Support',
      description:
        'Get help when you need it with our dedicated support team available around the clock.',
      icon: 'support_agent',
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description:
        'Gain deep insights into your business with powerful analytics and reporting tools.',
      icon: 'analytics',
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description:
        'Work together seamlessly with real-time collaboration and communication features.',
      icon: 'groups',
    },
    {
      id: 'scalability',
      title: 'Infinite Scalability',
      description:
        'Scale your operations without limits as your business grows and evolves.',
      icon: 'trending_up',
    },
  ];

  faqs: PricingSection13FAQ[] = [
    {
      id: 'trial',
      question: 'How does the free trial work?',
      answer:
        'You get full access to all Professional features for 14 days, no credit card required. You can cancel anytime during the trial period.',
    },
    {
      id: 'upgrade',
      question: 'Can I upgrade or downgrade my plan?',
      answer:
        'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.',
    },
    {
      id: 'data',
      question: 'What happens to my data if I cancel?',
      answer:
        'Your data is safely stored for 30 days after cancellation. You can export your data or reactivate your account during this period.',
    },
    {
      id: 'support',
      question: 'What kind of support do you offer?',
      answer:
        'We offer email support for all plans, priority support for Professional users, and dedicated support for Enterprise customers.',
    },
  ];
}
