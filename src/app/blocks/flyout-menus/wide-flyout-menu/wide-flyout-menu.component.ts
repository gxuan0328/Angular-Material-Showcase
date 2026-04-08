/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/wide-flyout-menu`
*/

import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';

import { NgTemplateOutlet } from '@angular/common';
import { DeviceService } from '../../utils/services/device.service';
import { OverlayWrapperComponent } from '../../wrappers/overlay-wrapper/overlay-wrapper.component';

type QuickLink = {
  label: string;
  href: string;
};

type Feature = {
  icon: string;
  title: string;
  description: string;
  href: string;
};

type CallToAction = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-wide-flyout-menu',
  templateUrl: './wide-flyout-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbar,
    MatDivider,
    CdkOverlayOrigin,
    OverlayWrapperComponent,
    NgTemplateOutlet,
  ],
})
export class WideFlyoutMenuComponent {
  mobileMenuOpen = signal(false);
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  features: Feature[] = [
    {
      icon: 'science',
      title: 'Research & Development',
      description: 'Cutting-edge innovation labs and experimental features',
      href: '#',
    },
    {
      icon: 'psychology',
      title: 'AI Automation',
      description: 'Intelligent workflows powered by machine learning',
      href: '#',
    },
    {
      icon: 'hub',
      title: 'Integration Platform',
      description: 'Connect all your business tools seamlessly',
      href: '#',
    },
    {
      icon: 'workspace_premium',
      title: 'Enterprise Solutions',
      description: 'Scalable infrastructure for growing teams',
      href: '#',
    },
    {
      icon: 'bolt',
      title: 'Performance Tools',
      description: 'Optimize speed and efficiency across systems',
      href: '#',
    },
    {
      icon: 'support_agent',
      title: 'Premium Support',
      description: '24/7 dedicated assistance for all customers',
      href: '#',
    },
  ];

  quickLinks: QuickLink[] = [
    { label: 'Getting Started Guide', href: '#' },
    { label: 'API Documentation', href: '#' },
    { label: 'Video Tutorials', href: '#' },
    { label: 'Community Forum', href: '#' },
  ];

  callToAction: CallToAction = {
    title: 'Ready to get started?',
    description: 'Join thousands of teams already using our platform',
    buttonLabel: 'Start free trial',
    href: '#',
  };
}
