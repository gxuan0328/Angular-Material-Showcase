/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-4`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

type Benefit = {
  title: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-4',
  templateUrl: './feature-section-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection4Component {
  benefits: Benefit[] = [
    {
      title: 'Work in Zurich',
      description:
        'We are in-person first and have a fantastic office in Zurich.',
    },
    {
      title: 'Competitive salary & equity',
      description:
        'We pay competitive salary and option packages to attract the very best talent.',
    },
    {
      title: 'Health, dental, vision',
      description:
        'Database pays all of your health, dental, and vision insurance.',
    },
    {
      title: 'Yearly off-sites',
      description:
        'We bring everyone together at an interesting location to discuss the big picture.',
    },
    {
      title: 'Book budget',
      description:
        'We provide every employee with a 350 dollar budget for books.',
    },
    {
      title: 'Tasty snacks',
      description:
        'The fridge and pantry are stocked + free dinner catered every night (incl. weekends).',
    },
    {
      title: '20 PTO days per year',
      description: 'Take time off to recharge and come back refreshed.',
    },
    {
      title: 'Spotify Premium',
      description:
        'We really have the best fringe benefits, even a Spotify subscription is included.',
    },
  ];
}
