/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/flyout-with-stats`
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

type MenuItem = {
  icon: string;
  label: string;
  href: string;
};

type Stat = {
  value: string;
  label: string;
};

@Component({
  selector: 'ngm-dev-block-flyout-with-stats',
  templateUrl: './flyout-with-stats.component.html',
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
export class FlyoutWithStatsComponent {
  mobileMenuOpen = signal(false);
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  menuItems: MenuItem[] = [
    { icon: 'info', label: 'About Us', href: '#' },
    { icon: 'newspaper', label: 'Press & Media', href: '#' },
    { icon: 'work', label: 'Careers', href: '#' },
    { icon: 'handshake', label: 'Partners', href: '#' },
    { icon: 'gavel', label: 'Legal', href: '#' },
    { icon: 'contact_mail', label: 'Contact', href: '#' },
  ];

  stats: Stat[] = [
    { value: '50K+', label: 'Active Users' },
    { value: '180+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];
}
