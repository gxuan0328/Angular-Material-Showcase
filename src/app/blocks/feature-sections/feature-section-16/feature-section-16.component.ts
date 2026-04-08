/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-16`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

type Brand = {
  name: string;
  logo: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-16',
  templateUrl: './feature-section-16.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection16Component {
  brands: Brand[] = [
    { name: 'Acme Corp', logo: 'AC' },
    { name: 'TechFlow', logo: 'TF' },
    { name: 'DataSync', logo: 'DS' },
    { name: 'CloudVault', logo: 'CV' },
    { name: 'NextWave', logo: 'NW' },
    { name: 'PrimeStack', logo: 'PS' },
  ];
}
