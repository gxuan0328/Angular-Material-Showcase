/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/flyout-with-preview`
*/

import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
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

type ProductItem = {
  icon: string;
  label: string;
  description: string;
  href: string;
};

type FeaturedContent = {
  title: string;
  description: string;
  image: string;
  href: string;
  label: string;
};

@Component({
  selector: 'ngm-dev-block-flyout-with-preview',
  templateUrl: './flyout-with-preview.component.html',
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
export class FlyoutWithPreviewComponent {
  readonly mobileMenuOpen = signal(false);
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  productItems: ProductItem[] = [
    {
      icon: 'analytics',
      label: 'Analytics Engine',
      description: 'Advanced data analysis tools',
      href: '#',
    },
    {
      icon: 'security',
      label: 'Security Suite',
      description: 'Enterprise-grade protection',
      href: '#',
    },
    {
      icon: 'cloud_sync',
      label: 'Cloud Sync',
      description: 'Seamless data synchronization',
      href: '#',
    },
    {
      icon: 'monitoring',
      label: 'Real-time Monitor',
      description: 'Track performance metrics',
      href: '#',
    },
  ];

  featuredProduct: FeaturedContent = {
    title: 'New Feature Release',
    description:
      'Discover our latest AI-powered analytics dashboard with enhanced visualization capabilities.',
    image: 'https://placehold.co/400x300/6366f1/ffffff?text=Featured',
    href: '#',
    label: 'Learn more',
  };

  blogPosts: FeaturedContent[] = [
    {
      title: 'Building Scalable Applications',
      description: 'Best practices for modern web development',
      image: 'https://placehold.co/300x200/8b5cf6/ffffff?text=Post+1',
      href: '#',
      label: 'Read article',
    },
    {
      title: 'Security Best Practices',
      description: 'Protecting your data in the cloud era',
      image: 'https://placehold.co/300x200/ec4899/ffffff?text=Post+2',
      href: '#',
      label: 'Read article',
    },
  ];
}
