/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update multi-column/constrained-with-sticky-columns`
*/

import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

type User = {
  name: string;
  email: string;
  imageUrl: string;
};

@Component({
  selector: 'ngm-dev-block-content-placeholder-constrained-with-sticky-columns',
  template: `
    <div
      class="relative h-full overflow-hidden rounded-xl border border-dashed border-gray-400 opacity-75"
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
export class ContentPlaceholderConstrainedWithStickyColumnsComponent {
  readonly patternId = input('constrained-with-sticky-columns-pattern-1');
}

@Component({
  selector: 'ngm-dev-block-constrained-with-sticky-columns',
  templateUrl: './constrained-with-sticky-columns.component.html',
  styleUrls: ['./constrained-with-sticky-columns.component.scss'],

  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ContentPlaceholderConstrainedWithStickyColumnsComponent,
  ],
})
export class ConstrainedWithStickyColumnsComponent {
  user: User = {
    name: 'John Doe',
    email: 'john@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };
}
