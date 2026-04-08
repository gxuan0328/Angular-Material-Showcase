/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update pricing-sections/pricing-section-2`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardActions,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatChipSet, MatChip } from '@angular/material/chips';

type PricingSection2Plan = {
  name: string;
  price: string;
  badgeText: string;
  description: string;
  features: string[];
  footnote: string;
  isUpgrade: boolean;
  buttonText: string | false;
  buttonLink: string | false;
};

@Component({
  selector: 'ngm-dev-block-pricing-section-2',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatCardFooter,
    MatCardActions,
    MatChipSet,
    MatChip,
  ],
  templateUrl: './pricing-section-2.component.html',
  styleUrls: ['./pricing-section-2.component.scss'],
})
export class PricingSection2Component {
  plans: PricingSection2Plan[] = [
    {
      name: 'Your plan',
      price: '$0',
      badgeText: 'current',
      description: 'Get started with your current plan',
      features: [
        '10 user seats',
        'Up to 1,000 requests per day¹',
        '10GB of storage',
        'Slack community support',
        '7 days of activity history',
      ],
      footnote:
        '¹Fair usage policy. Exceeding the limit for one time will not result in the account being closed.',
      isUpgrade: false,
      buttonText: false,
      buttonLink: false,
    },
    {
      name: 'Workplace Plus',
      price: '$50',
      badgeText: 'add-on',
      description: 'Unlock the full potential of your data',
      features: [
        'Up to 50 user seats¹',
        'Unlimited requests per day',
        '50GB of storage',
        'Private Slack support',
        '30 days of activity history',
      ],
      footnote: '¹$1 per month per additional user seat.',
      isUpgrade: true,
      buttonText: 'Upgrade',
      buttonLink: '#',
    },
  ];
}
