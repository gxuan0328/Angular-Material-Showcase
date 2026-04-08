/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update header-sections/header-section-5`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-header-section-5',
  templateUrl: './header-section-5.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class HeaderSection5Component {
  logos = [
    'https://placehold.co/120x40/e0e0e0/666?text=Company1',
    'https://placehold.co/120x40/e0e0e0/666?text=Company2',
    'https://placehold.co/120x40/e0e0e0/666?text=Company3',
    'https://placehold.co/120x40/e0e0e0/666?text=Company4',
    'https://placehold.co/120x40/e0e0e0/666?text=Company5',
    'https://placehold.co/120x40/e0e0e0/666?text=Company6',
  ];
}
