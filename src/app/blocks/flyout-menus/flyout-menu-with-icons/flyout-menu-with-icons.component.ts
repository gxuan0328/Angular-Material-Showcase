/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/flyout-menu-with-icons`
*/

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { DeviceService } from '../../utils/services/device.service';
import { OverlayWrapperComponent } from '../../wrappers/overlay-wrapper/overlay-wrapper.component';
import { NgTemplateOutlet } from '@angular/common';
import { MatCard } from '@angular/material/card';

type MenuItemWithIcon = {
  icon: string;
  label: string;
  description: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-flyout-menu-with-icons',
  templateUrl: './flyout-menu-with-icons.component.html',
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
    MatCard,
  ],
})
export class FlyoutMenuWithIconsComponent {
  mobileMenuOpen = signal(false);
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }
  solutionsItems: MenuItemWithIcon[] = [
    {
      icon: 'analytics',
      label: 'Analytics Platform',
      description: 'Track and visualize your data in real-time',
      href: '#',
    },
    {
      icon: 'shield',
      label: 'Security Tools',
      description: 'Protect your applications and data',
      href: '#',
    },
    {
      icon: 'cloud',
      label: 'Cloud Storage',
      description: 'Store and access files from anywhere',
      href: '#',
    },
    {
      icon: 'speed',
      label: 'Performance Monitor',
      description: 'Optimize your application speed',
      href: '#',
    },
  ];

  companyItems: MenuItemWithIcon[] = [
    {
      icon: 'people',
      label: 'About Us',
      description: 'Learn about our mission and team',
      href: '#',
    },
    {
      icon: 'newspaper',
      label: 'Newsroom',
      description: 'Latest updates and announcements',
      href: '#',
    },
    {
      icon: 'work',
      label: 'Careers',
      description: 'Join our growing team',
      href: '#',
    },
    {
      icon: 'contact_mail',
      label: 'Contact',
      description: 'Get in touch with us',
      href: '#',
    },
  ];
}
