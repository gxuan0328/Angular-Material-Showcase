/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/flyout-with-cards`
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
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgTemplateOutlet } from '@angular/common';
import { DeviceService } from '../../utils/services/device.service';
import { OverlayWrapperComponent } from '../../wrappers/overlay-wrapper/overlay-wrapper.component';
import { MatBadge } from '@angular/material/badge';

type ProductCard = {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-flyout-with-cards',
  templateUrl: './flyout-with-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbar,
    MatDivider,
    MatCard,
    CdkOverlayOrigin,
    OverlayWrapperComponent,
    NgTemplateOutlet,
    MatBadge,
    MatCardContent,
  ],
})
export class FlyoutWithCardsComponent {
  mobileMenuOpen = signal(false);
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  products: ProductCard[] = [
    {
      icon: 'rocket_launch',
      title: 'Starter Plan',
      description: 'Perfect for individuals and small projects',
      badge: 'Popular',
      href: '#',
    },
    {
      icon: 'business_center',
      title: 'Professional',
      description: 'Advanced features for growing businesses',
      href: '#',
    },
    {
      icon: 'apartment',
      title: 'Enterprise',
      description: 'Complete solution for large organizations',
      badge: 'New',
      href: '#',
    },
  ];
}
