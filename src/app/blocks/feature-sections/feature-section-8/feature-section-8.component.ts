/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-8`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type Feature = {
  title: string;
  description: string;
  icon: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-8',
  templateUrl: './feature-section-8.component.html',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection8Component {
  features: Feature[] = [
    {
      title: 'Smart automation',
      description:
        'Automate repetitive tasks and workflows with intelligent triggers. Save hours every week with our AI-powered automation engine.',
      icon: 'auto_awesome',
    },
    {
      title: 'Data insights',
      description:
        'Transform raw data into actionable insights. Advanced analytics help you make informed decisions faster than ever.',
      icon: 'insights',
    },
    {
      title: 'Seamless sync',
      description:
        'Keep everything in sync across all your devices. Changes update instantly, ensuring you always have the latest information.',
      icon: 'sync',
    },
  ];

  getGridClasses(index: number): string {
    const baseClasses = 'grid grid-cols-1 items-center gap-12 lg:grid-cols-2';
    const dynamicClasses = index % 2 === 1 ? 'lg:grid-flow-col-dense' : '';
    return `${baseClasses} ${dynamicClasses}`.trim();
  }

  getContentClasses(index: number): string {
    const baseClasses = 'flex flex-col';
    const dynamicClasses = index % 2 === 1 ? 'lg:col-start-2' : '';
    return `${baseClasses} ${dynamicClasses}`.trim();
  }

  getImageClasses(index: number): string {
    const baseClasses =
      'relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/50 dark:to-violet-800/50';
    const dynamicClasses = index % 2 === 1 ? 'lg:col-start-1' : '';
    return `${baseClasses} ${dynamicClasses}`.trim();
  }
}
