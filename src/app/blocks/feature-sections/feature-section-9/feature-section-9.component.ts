/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-9`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type Feature = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-9',
  templateUrl: './feature-section-9.component.html',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection9Component {
  features: Feature[] = [
    {
      title: 'Cloud Storage',
      description:
        'Store and access your files from anywhere. Unlimited storage with enterprise-grade encryption.',
      icon: 'cloud',
      color: 'blue',
    },
    {
      title: 'Mobile Apps',
      description:
        'Stay productive on the go with our native mobile apps for iOS and Android.',
      icon: 'phone_android',
      color: 'violet',
    },
    {
      title: 'Smart Search',
      description:
        'Find anything instantly with our powerful search engine powered by machine learning.',
      icon: 'search',
      color: 'green',
    },
    {
      title: 'Export Tools',
      description:
        'Export your data in any format. PDF, CSV, Excel, and more with one click.',
      icon: 'download',
      color: 'orange',
    },
  ];

  getIconContainerClasses(color: string): string {
    const baseClasses =
      'w-fit rounded-lg p-3 transition-transform group-hover:scale-110';
    const colorMap: Record<string, string> = {
      violet: 'bg-violet-100 dark:bg-violet-900/30',
      blue: 'bg-blue-100 dark:bg-blue-900/30',
      green: 'bg-green-100 dark:bg-green-900/30',
      orange: 'bg-orange-100 dark:bg-orange-900/30',
    };
    const dynamicClasses = colorMap[color] || '';
    return `${baseClasses} ${dynamicClasses}`.trim();
  }

  getIconClasses(color: string): string {
    const baseClasses = 'text-[2rem]! size-[1em]!';
    const colorMap: Record<string, string> = {
      violet: 'text-violet-600 dark:text-violet-400',
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      orange: 'text-orange-600 dark:text-orange-400',
    };
    const dynamicClasses = colorMap[color] || '';
    return `${baseClasses} ${dynamicClasses}`.trim();
  }
}
