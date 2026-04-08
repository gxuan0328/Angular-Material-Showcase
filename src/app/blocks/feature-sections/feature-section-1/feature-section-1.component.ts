/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-1`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

type Stat = {
  name: string;
  value: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-1',
  templateUrl: './feature-section-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection1Component {
  stats: Stat[] = [
    {
      name: 'Bandwith increase',
      value: '+162%',
    },
    {
      name: 'Better storage efficiency',
      value: '2-3x',
    },
    {
      name: 'Rows ingested / second',
      value: 'Up to 9M',
    },
  ];
}
