/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-11`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

type TabFeature = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
};

@Component({
  selector: 'ngm-dev-block-feature-section-11',
  templateUrl: './feature-section-11.component.html',
  imports: [MatIcon, MatTabsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection11Component {
  selectedTab = 0;

  tabs: TabFeature[] = [
    {
      id: 'productivity',
      label: 'Productivity',
      icon: 'speed',
      title: 'Boost your team productivity',
      description:
        'Streamline workflows and eliminate bottlenecks with intelligent automation and smart tools.',
      features: [
        'Task automation engine',
        'Smart scheduling system',
        'Collaboration tools',
        'Performance analytics',
      ],
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      icon: 'link',
      title: 'Stay connected everywhere',
      description:
        'Access your workspace from any device, anywhere. Offline mode ensures you never lose productivity.',
      features: [
        'Cross-platform sync',
        'Offline mode support',
        'Real-time updates',
        'Multi-device access',
      ],
    },
    {
      id: 'customization',
      label: 'Customization',
      icon: 'tune',
      title: 'Tailor it to your needs',
      description:
        'Customize every aspect of the platform to match your workflow and preferences.',
      features: [
        'Custom themes and layouts',
        'Workflow builder',
        'Template library',
        'Personalized dashboards',
      ],
    },
  ];
}
