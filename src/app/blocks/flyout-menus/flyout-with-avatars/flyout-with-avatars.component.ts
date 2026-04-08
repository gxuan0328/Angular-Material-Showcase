/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update flyout-menus/flyout-with-avatars`
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

type TeamMember = {
  name: string;
  role: string;
  avatar: string;
  href: string;
};

type Resource = {
  icon: string;
  title: string;
  description: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-flyout-with-avatars',
  templateUrl: './flyout-with-avatars.component.html',
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
export class FlyoutWithAvatarsComponent {
  mobileMenuOpen = signal(false);
  readonly isLessThanMD = toSignal(inject(DeviceService).isLessThanMD$);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  teamMembers: TeamMember[] = [
    {
      name: 'Alex Rivera',
      role: 'Chief Technology Officer',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHx8Mg%3D%3D',
      href: '#',
    },
    {
      name: 'Jordan Chen',
      role: 'Head of Product Design',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXxlbnwwfHwwfHx8Mg%3D%3D',
      href: '#',
    },
    {
      name: 'Sam Morgan',
      role: 'Engineering Lead',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFjZXxlbnwwfHwwfHx8Mg%3D%3D',
      href: '#',
    },
    {
      name: 'Taylor Kim',
      role: 'Customer Success Director',
      avatar:
        'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFjZXxlbnwwfHwwfHx8Mg%3D%3D',
      href: '#',
    },
  ];

  resources: Resource[] = [
    {
      icon: 'group_add',
      title: 'Join the Team',
      description: 'View open positions',
      href: '#',
    },
    {
      icon: 'diversity_3',
      title: 'Our Culture',
      description: 'Learn about us',
      href: '#',
    },
  ];
}
