/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-shells/page-shell-3`
*/

import { Component, signal, input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'ngm-dev-block-content-placeholder-shell3',
  template: `
    <div
      class="relative h-full overflow-hidden rounded bg-gray-50 dark:bg-gray-800"
    >
      <svg
        class="absolute inset-0 h-full w-full stroke-gray-200 dark:stroke-gray-700"
        fill="none"
      >
        <defs>
          <pattern
            [id]="patternId()"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
          </pattern>
        </defs>
        <rect
          stroke="none"
          [attr.fill]="'url(#' + patternId() + ')'"
          width="100%"
          height="100%"
        ></rect>
      </svg>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class ContentPlaceholderShell3Component {
  readonly patternId = input('pattern-1');
}

@Component({
  selector: 'ngm-dev-block-page-shell-3-logo',
  template: `
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      [attr.width]="width()"
      [attr.height]="height()"
      class="{{ cssClass() }}"
    >
      <path
        d="M10.9999 2.04938L11 5.07088C7.6077 5.55612 5 8.47352 5 12C5 15.866 8.13401 19 12 19C13.5723 19 15.0236 18.4816 16.1922 17.6064L18.3289 19.7428C16.605 21.1536 14.4014 22 12 22C6.47715 22 2 17.5228 2 12C2 6.81468 5.94662 2.55115 10.9999 2.04938ZM21.9506 13.0001C21.7509 15.0111 20.9555 16.8468 19.7433 18.3283L17.6064 16.1922C18.2926 15.2759 18.7595 14.1859 18.9291 13L21.9506 13.0001ZM13.0011 2.04948C17.725 2.51902 21.4815 6.27589 21.9506 10.9999L18.9291 10.9998C18.4905 7.93452 16.0661 5.50992 13.001 5.07103L13.0011 2.04948Z"
      />
    </svg>
  `,
})
export class LogoComponent {
  readonly width = input('20');
  readonly height = input('20');
  readonly cssClass = input('');
}

type TimeRange = {
  value: string;
  viewValue: string;
};

type Location = {
  value: string;
  viewValue: string;
};

type NavItem = {
  name: string;
  href: string;
  current: boolean;
};

@Component({
  selector: 'ngm-dev-block-page-shell-3',
  templateUrl: './page-shell-3.component.html',
  imports: [
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ContentPlaceholderShell3Component,
    LogoComponent,
  ],
})
export class PageShell3Component {
  timeRanges: TimeRange[] = [
    { value: '1', viewValue: 'Today' },
    { value: '2', viewValue: 'Last 7 days' },
    { value: '3', viewValue: 'Last 4 weeks' },
    { value: '4', viewValue: 'Last 12 months' },
  ];

  locations: Location[] = [
    { value: '1', viewValue: 'US-West' },
    { value: '2', viewValue: 'US-East' },
    { value: '3', viewValue: 'EU-Central-1' },
  ];

  navigation: NavItem[] = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Workspaces', href: '#', current: false },
    { name: 'Settings', href: '#', current: false },
  ];

  selectedTimeRange = signal<string>('1');
  selectedLocation = signal<string>('1');
}
