/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-pricing-sections/pricing-section-1`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardActions,
  MatCardTitle,
  MatCardAvatar,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';

type PricingSection1Feature = {
  id: number;
  name: string;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-1',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatCardAvatar,
  ],
  templateUrl: './pricing-section-1.component.html',
})
export class PricingSection1Component {
  features: PricingSection1Feature[] = [
    {
      id: 1,
      name: 'Invite unlimited members',
    },
    {
      id: 2,
      name: 'Create unlimited workspaces',
    },
    {
      id: 3,
      name: '90 days of history',
    },
    {
      id: 4,
      name: '24/7 priority support',
    },
    {
      id: 5,
      name: 'Access to all enterprise plugins',
    },
  ];
}
