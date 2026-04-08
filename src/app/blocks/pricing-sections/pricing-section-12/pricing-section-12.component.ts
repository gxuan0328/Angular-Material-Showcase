/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-12`
*/

import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardAvatar,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection12StandardPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  cta: string;
  popular: boolean;
  features: string[];
};

type PricingSection12CustomSolution = {
  id: string;
  name: string;
  description: string;
  icon: string;
  cta: string;
  features: string[];
};

@Component({
  selector: 'ngm-dev-block-pricing-section-12',
  imports: [
    MatButton,
    MatButtonToggleModule,
    MatCard,
    MatCardContent,
    MatDivider,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatCardActions,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardAvatar,
  ],
  templateUrl: './pricing-section-12.component.html',
})
export class PricingSection12Component {
  selectedPlanType = signal<'standard' | 'custom'>('standard');

  standardPlans: PricingSection12StandardPlan[] = [
    {
      id: 'startup',
      name: 'Startup',
      description:
        'Perfect for early-stage companies and MVPs looking to validate their ideas.',
      price: '$39',
      period: '/month',
      cta: 'Start your journey',
      popular: false,
      features: [
        '10 active projects',
        '100GB secure storage',
        'Basic workflow automation',
        'Email support',
        'Standard integrations',
        'Team collaboration tools',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      description:
        'Advanced features for scaling businesses and expanding teams.',
      price: '$89',
      period: '/month',
      cta: 'Accelerate growth',
      popular: true,
      features: [
        'Unlimited projects',
        '1TB secure storage',
        'Advanced automation',
        'Priority support',
        'Premium integrations',
        'Advanced analytics',
        'Custom workflows',
        'Multi-team management',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description:
        'Comprehensive solution for large organizations with complex requirements.',
      price: '$249',
      period: '/month',
      cta: 'Contact sales',
      popular: false,
      features: [
        'Everything in Growth',
        'Unlimited storage',
        'Dedicated success manager',
        '24/7 phone support',
        'Custom integrations',
        'Advanced security',
        'Compliance features',
        'On-premise deployment',
      ],
    },
  ];

  customSolutions: PricingSection12CustomSolution[] = [
    {
      id: 'consulting',
      name: 'Strategic Consulting',
      description:
        'Expert guidance to optimize your business processes and technology stack.',
      icon: 'psychology',
      cta: 'Book consultation',
      features: [
        'Business process analysis',
        'Technology roadmap planning',
        'Implementation strategy',
        'Performance optimization',
        'Change management support',
      ],
    },
    {
      id: 'development',
      name: 'Custom Development',
      description:
        'Tailored software solutions built specifically for your unique business needs.',
      icon: 'code',
      cta: 'Discuss project',
      features: [
        'Custom application development',
        'API integration services',
        'Database design & migration',
        'Quality assurance testing',
        'Deployment & maintenance',
      ],
    },
    {
      id: 'training',
      name: 'Team Training',
      description:
        'Comprehensive training programs to upskill your team and maximize platform adoption.',
      icon: 'school',
      cta: 'Schedule training',
      features: [
        'Customized curriculum',
        'Hands-on workshops',
        'Certification programs',
        'Ongoing support',
        'Progress tracking',
      ],
    },
    {
      id: 'integration',
      name: 'System Integration',
      description:
        'Seamlessly connect your existing tools and workflows with our platform.',
      icon: 'hub',
      cta: 'Plan integration',
      features: [
        'Legacy system migration',
        'Third-party integrations',
        'Data synchronization',
        'Workflow automation',
        'Testing & validation',
      ],
    },
  ];

  onPlanTypeChange(planType: 'standard' | 'custom'): void {
    this.selectedPlanType.set(planType);
  }
}
