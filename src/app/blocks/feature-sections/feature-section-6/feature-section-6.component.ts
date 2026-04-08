/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-6`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FeatureSection6GlobeComponent } from './globe.component';

@Component({
  selector: 'ngm-dev-block-feature-section-6-globe-placeholder',
  template: `
    <div
      style="width: 800px; height: 800px"
      class="absolute -right-72 top-40 z-10 aspect-square size-full max-w-fit transition-transform group-hover:scale-[1.01] sm:top-12 lg:-right-60 lg:top-0"
      data-testid="feature-section-6-globe-placeholder"
    >
      <div
        class="size-full rounded-full bg-gray-200/50 dark:bg-gray-800/50 animate-pulse"
      ></div>
    </div>
  `,

  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection6GlobePlaceholderComponent {}
@Component({
  selector: 'ngm-dev-block-feature-section-6',
  templateUrl: './feature-section-6.component.html',
  imports: [
    MatIcon,
    MatButtonModule,
    FeatureSection6GlobeComponent,
    FeatureSection6GlobePlaceholderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection6Component {}
