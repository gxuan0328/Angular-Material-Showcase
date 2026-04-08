/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bento-grids/bento-grid-6`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';

type Feature = {
  icon: string;
  title: string;
  description: string;
  colorClass: string;
  iconColorClass: string;
  badge?: string;
};

@Component({
  selector: 'ngm-dev-block-bento-grid-6',
  templateUrl: './bento-grid-6.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton, NgClass],
})
export class BentoGrid6Component {
  trustBadges = ['SOC 2 Type II', 'GDPR Compliant', 'ISO 27001'];

  features: Feature[] = [
    {
      icon: 'flash_on',
      title: 'Lightning Fast',
      description: 'Optimized performance with global CDN and edge computing.',
      colorClass: 'bg-primary/10',
      iconColorClass: 'text-primary',
      badge: 'New',
    },
    {
      icon: 'psychology',
      title: 'AI-Powered',
      description: 'Intelligent automation and smart recommendations built-in.',
      colorClass: 'bg-secondary/10',
      iconColorClass: 'text-secondary',
    },
    {
      icon: 'devices',
      title: 'Cross-Platform',
      description: 'Works seamlessly across web, mobile, and desktop.',
      colorClass: 'bg-tertiary/10',
      iconColorClass: 'text-tertiary',
    },
  ];
}
