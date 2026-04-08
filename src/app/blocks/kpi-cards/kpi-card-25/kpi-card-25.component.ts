/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-25`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import { AvailableChartColorsKeys } from '../../utils/functions/chart-utils';

type Category = {
  percentage: number;
  label: string;
  color: string;
};

type CardData = {
  title: string;
  value: string;
  categoryValues: number[];
  categoryColors: AvailableChartColorsKeys[];
  categories: Category[];
};

@Component({
  selector: 'ngm-dev-block-kpi-card-25',
  imports: [MatCard, MatCardContent, CategoryBarComponent],
  templateUrl: './kpi-card-25.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard25Component {
  cards: CardData[] = [
    {
      title: 'Active Projects',
      value: '358',
      categoryValues: [78, 15, 7],
      categoryColors: ['blue', 'gray', 'red'],
      categories: [
        {
          percentage: 78,
          label: 'Completed',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        { percentage: 15, label: 'In Progress', color: 'bg-gray-500' },
        {
          percentage: 7,
          label: 'Blocked',
          color: 'bg-red-500 dark:bg-red-500',
        },
      ],
    },
    {
      title: 'System Health',
      value: '98,245',
      categoryValues: [62, 18, 20],
      categoryColors: ['blue', 'gray', 'red'],
      categories: [
        {
          percentage: 62,
          label: 'Healthy',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        { percentage: 18, label: 'Warning', color: 'bg-gray-500' },
        {
          percentage: 20,
          label: 'Critical',
          color: 'bg-red-500 dark:bg-red-500',
        },
      ],
    },
    {
      title: 'Response Time',
      value: '2,156ms',
      categoryValues: [68, 25, 7],
      categoryColors: ['blue', 'gray', 'red'],
      categories: [
        {
          percentage: 68,
          label: 'Fast',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        { percentage: 25, label: 'Average', color: 'bg-gray-500' },
        { percentage: 7, label: 'Slow', color: 'bg-red-500 dark:bg-red-500' },
      ],
    },
  ];
}
