/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-3`
*/

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
type PricingSection3Plan = {
  name: string;
  price: string;
  isRecommended: boolean;
};

type PricingSection3Feature = {
  id: number;
  name: string;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-3',
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatRadioModule,
    MatCardActions,
  ],
  templateUrl: './pricing-section-3.component.html',
})
export class PricingSection3Component {
  plans: PricingSection3Plan[] = [
    {
      name: 'Billed annually',
      price: '$29',
      isRecommended: true,
    },
    {
      name: 'Billed monthly',
      price: '$39',
      isRecommended: false,
    },
  ];

  features: PricingSection3Feature[] = [
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

  selectedPlan = this.plans[0];

  onSubmit(): void {
    console.log('Selected plan:', this.selectedPlan);
  }
}
