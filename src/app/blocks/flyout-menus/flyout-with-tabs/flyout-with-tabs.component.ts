/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/flyout-with-tabs`
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

import { DeviceService } from '../../utils/services/device.service';
import { OverlayWrapperComponent } from '../../wrappers/overlay-wrapper/overlay-wrapper.component';

type TabItem = {
  id: string;
  label: string;
  icon: string;
};

type ContentItem = {
  icon: string;
  title: string;
  description: string;
  href: string;
};

type TabContent = {
  [key: string]: ContentItem[];
};

@Component({
  selector: 'ngm-dev-block-flyout-with-tabs',
  templateUrl: './flyout-with-tabs.component.html',
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
  ],
})
export class FlyoutWithTabsComponent {
  mobileMenuOpen = signal(false);
  readonly activeTab = signal('solutions');
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }

  getActiveContent(): ContentItem[] {
    return this.tabContent[this.activeTab()];
  }

  tabs: TabItem[] = [
    { id: 'solutions', label: 'Solutions', icon: 'lightbulb' },
    { id: 'industries', label: 'Industries', icon: 'business' },
    { id: 'resources', label: 'Resources', icon: 'library_books' },
  ];

  tabContent: TabContent = {
    solutions: [
      {
        icon: 'analytics',
        title: 'Data Analytics',
        description: 'Transform raw data into insights',
        href: '#',
      },
      {
        icon: 'shield_lock',
        title: 'Security Hub',
        description: 'Enterprise-grade protection',
        href: '#',
      },
      {
        icon: 'cloud_sync',
        title: 'Cloud Services',
        description: 'Scalable infrastructure',
        href: '#',
      },
      {
        icon: 'devices',
        title: 'Multi-Platform',
        description: 'Works everywhere you do',
        href: '#',
      },
    ],
    industries: [
      {
        icon: 'local_hospital',
        title: 'Healthcare',
        description: 'HIPAA-compliant solutions',
        href: '#',
      },
      {
        icon: 'account_balance',
        title: 'Finance',
        description: 'Banking-grade security',
        href: '#',
      },
      {
        icon: 'storefront',
        title: 'Retail',
        description: 'Omnichannel commerce',
        href: '#',
      },
      {
        icon: 'precision_manufacturing',
        title: 'Manufacturing',
        description: 'Industrial automation',
        href: '#',
      },
    ],
    resources: [
      {
        icon: 'menu_book',
        title: 'Documentation',
        description: 'Complete technical guides',
        href: '#',
      },
      {
        icon: 'play_circle',
        title: 'Video Courses',
        description: 'Interactive learning',
        href: '#',
      },
      {
        icon: 'groups',
        title: 'Community',
        description: 'Connect with experts',
        href: '#',
      },
      {
        icon: 'headset_mic',
        title: 'Support Portal',
        description: 'Get help anytime',
        href: '#',
      },
    ],
  };
}
