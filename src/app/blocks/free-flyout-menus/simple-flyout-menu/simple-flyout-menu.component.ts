/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-flyout-menus/simple-flyout-menu`
*/

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { DeviceService } from '../../utils/services/device.service';
import { toSignal } from '@angular/core/rxjs-interop';

type MenuItem = {
  label: string;
  href: string;
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
};

@Component({
  selector: 'ngm-dev-block-simple-flyout-menu',
  templateUrl: './simple-flyout-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatToolbar,
  ],
})
export class SimpleFlyoutMenuComponent {
  mobileMenuOpen = signal(false);
  readonly isLessThanLG = toSignal(inject(DeviceService).isLessThanLG$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }
  productCategories: MenuCategory[] = [
    {
      title: 'Analytics',
      items: [
        { label: 'Overview Dashboard', href: '#' },
        { label: 'Real-time Stats', href: '#' },
        { label: 'Custom Reports', href: '#' },
      ],
    },
    {
      title: 'Engagement',
      items: [
        { label: 'Email Campaigns', href: '#' },
        { label: 'Social Media', href: '#' },
        { label: 'Content Hub', href: '#' },
      ],
    },
  ];

  resourceCategories: MenuCategory[] = [
    {
      title: 'Learn',
      items: [
        { label: 'Documentation', href: '#' },
        { label: 'Tutorials', href: '#' },
        { label: 'API Reference', href: '#' },
      ],
    },
    {
      title: 'Community',
      items: [
        { label: 'Forums', href: '#' },
        { label: 'Events', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
  ];
}
