/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/multi-column-flyout`
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

type MenuItem = {
  icon: string;
  label: string;
  description: string;
  href: string;
};

type MenuColumn = {
  title: string;
  items: MenuItem[];
};

@Component({
  selector: 'ngm-dev-block-multi-column-flyout',
  templateUrl: './multi-column-flyout.component.html',
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
export class MultiColumnFlyoutComponent {
  readonly mobileMenuOpen = signal(false);
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  productColumns: MenuColumn[] = [
    {
      title: 'Features',
      items: [
        {
          icon: 'dashboard',
          label: 'Dashboard',
          description: 'Comprehensive overview of your data',
          href: '#',
        },
        {
          icon: 'insights',
          label: 'Insights',
          description: 'AI-powered analytics and predictions',
          href: '#',
        },
        {
          icon: 'integration_instructions',
          label: 'Integrations',
          description: 'Connect with your favorite tools',
          href: '#',
        },
      ],
    },
    {
      title: 'Tools',
      items: [
        {
          icon: 'code',
          label: 'API Access',
          description: 'Full REST API documentation',
          href: '#',
        },
        {
          icon: 'webhook',
          label: 'Webhooks',
          description: 'Real-time event notifications',
          href: '#',
        },
        {
          icon: 'terminal',
          label: 'CLI Tools',
          description: 'Command-line interface utilities',
          href: '#',
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          icon: 'library_books',
          label: 'Documentation',
          description: 'Complete guides and references',
          href: '#',
        },
        {
          icon: 'school',
          label: 'Tutorials',
          description: 'Step-by-step learning paths',
          href: '#',
        },
        {
          icon: 'forum',
          label: 'Community',
          description: 'Connect with other users',
          href: '#',
        },
      ],
    },
  ];

  resourceColumns: MenuColumn[] = [
    {
      title: 'Learn',
      items: [
        {
          icon: 'article',
          label: 'Blog',
          description: 'Latest insights and updates',
          href: '#',
        },
        {
          icon: 'video_library',
          label: 'Webinars',
          description: 'Live and recorded sessions',
          href: '#',
        },
        {
          icon: 'auto_stories',
          label: 'Case Studies',
          description: 'Real-world success stories',
          href: '#',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help',
          label: 'Help Center',
          description: 'Find answers quickly',
          href: '#',
        },
        {
          icon: 'support_agent',
          label: 'Contact',
          description: 'Get in touch with our team',
          href: '#',
        },
        {
          icon: 'bug_report',
          label: 'Report Issue',
          description: 'Submit bug reports',
          href: '#',
        },
      ],
    },
  ];

  // Flatten columns for mobile menu
  get productItems(): MenuItem[] {
    return this.productColumns.flatMap((column) => column.items);
  }

  get resourceItems(): MenuItem[] {
    return this.resourceColumns.flatMap((column) => column.items);
  }
}
