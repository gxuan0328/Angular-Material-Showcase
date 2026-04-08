/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-7`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSection7GlobeComponent } from './globe.component';
type Feature = {
  name: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-7-globe-placeholder',
  template: `
    <div
      class="absolute top-[10rem] z-20 aspect-square size-full max-w-fit sm:top-[7.1rem] md:top-[12rem] flex items-center justify-center"
      style="width: 1200px; height: 1200px"
      data-testid="feature-section-7-globe-placeholder"
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
export class FeatureSection7GlobePlaceholderComponent {}

@Component({
  selector: 'ngm-dev-block-feature-section-7',
  templateUrl: './feature-section-7.component.html',
  imports: [
    FeatureSection7GlobeComponent,
    FeatureSection7GlobePlaceholderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection7Component {
  features: Feature[] = [
    {
      name: 'Global Clusters',
      description: 'Enable low-latency global access, enhancing performance.',
    },
    {
      name: 'Serverless Triggers',
      description: 'Trigger functions automatically for dynamic app behavior.',
    },
    {
      name: 'Monitoring & Alerts',
      description:
        'Monitor health with key metrics or integrate third-party tools.',
    },
  ];
}
