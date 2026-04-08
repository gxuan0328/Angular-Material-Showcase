/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update cta-sections/cta-section-16`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-cta-section-16',
  templateUrl: './cta-section-16.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class CtaSection16Component {
  ctaItems = [
    {
      title: 'For individuals',
      description: 'Perfect for freelancers and solo entrepreneurs',
      action: 'Start free',
      icon: 'person',
    },
    {
      title: 'For teams',
      description: 'Collaboration tools for growing businesses',
      action: 'Try for free',
      icon: 'groups',
    },
    {
      title: 'For enterprises',
      description: 'Advanced features and dedicated support',
      action: 'Contact us',
      icon: 'business',
    },
  ];
}
