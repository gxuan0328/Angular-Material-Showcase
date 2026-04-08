/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-shells/page-shell-4`
*/

import { Component, signal, input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'ngm-dev-block-content-placeholder-shell4',
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
export class ContentPlaceholderShell4Component {
  readonly patternId = input('pattern-1');
}

type ReportItem = {
  id: number;
  name: string;
  description: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-page-shell-4',
  templateUrl: './page-shell-4.component.html',
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    ContentPlaceholderShell4Component,
    FormsModule,
  ],
})
export class PageShell4Component {
  searchQuery = signal<string>('');

  recentExpanded = signal<boolean>(true);
  allExpanded = signal<boolean>(false);

  reportData: ReportItem[] = [
    {
      id: 1,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 2,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 3,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 4,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 5,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 6,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
  ];

  get recentReports(): ReportItem[] {
    return this.reportData.slice(0, 3);
  }
}
