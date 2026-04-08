/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-23`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';

type KpiData = {
  channel: string;
  share: number;
  revenue: string;
  color: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-23',
  imports: [MatCard, MatCardContent, MatIcon, CategoryBarComponent],
  templateUrl: './kpi-card-23.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard23Component {
  data: KpiData[] = [
    {
      channel: 'Enterprise Sales',
      share: 42.5,
      revenue: '$206.2K',
      color: 'bg-blue-500',
      href: '#',
    },
    {
      channel: 'Partner Network',
      share: 28.8,
      revenue: '$139.8K',
      color: 'bg-orange-500',
      href: '#',
    },
    {
      channel: 'Online Store',
      share: 18.2,
      revenue: '$88.3K',
      color: 'bg-sky-500',
      href: '#',
    },
    {
      channel: 'Resellers',
      share: 10.5,
      revenue: '$50.9K',
      color: 'bg-gray-500',
      href: '#',
    },
  ];
}
