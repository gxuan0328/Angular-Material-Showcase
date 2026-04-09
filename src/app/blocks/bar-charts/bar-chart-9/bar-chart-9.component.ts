/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-9`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ChartConfiguration, ChartData, TooltipModel } from 'chart.js';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { DecimalPipe } from '@angular/common';

type TabConfig = {
  name: string;
  data: ChartData<'bar', number[], string>;
  categories: string[]; // for parity with spec, not used directly here
  colors: string[];
  summary: { name: string; total: number; color: string }[];
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-9',

  imports: [
    BaseChartDirective,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    MatTabGroup,
    MatTab,
    DecimalPipe,
    MatCardSubtitle,
  ],
  templateUrl: './bar-chart-9.component.html',
  styleUrls: ['./bar-chart-9.component.scss'],
})
export class BarChart9Component {
  private readonly cdr = inject(ChangeDetectorRef);

  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;

  private readonly labels = Array.from(
    { length: 31 },
    (_, i) => `Aug ${String(i + 1).padStart(2, '0')}`,
  );

  private series(length: number, min: number, max: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < length; i++)
      out.push(Math.floor(min + Math.random() * (max - min)));
    return out;
  }

  private makeStacked(
    colors: string[],
    labels: string[],
    keys: string[],
  ): ChartData<'bar', number[], string> {
    return {
      labels,
      datasets: keys.map((k, i) => ({
        label: k,
        data: this.series(labels.length, 400, 1500),
        backgroundColor: colors[i],
        borderColor: colors[i],
        borderWidth: 1,
        stack: 's',
      })),
    };
  }

  readonly tabs: TabConfig[] = [
    {
      name: 'Ratio',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Successful requests',
            data: this.series(this.labels.length, 450, 1500),
            backgroundColor: 'rgb(59,130,246)',
            borderColor: 'rgb(59,130,246)',
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Errors',
            data: this.series(this.labels.length, 0, 220),
            backgroundColor: 'rgb(239,68,68)',
            borderColor: 'rgb(239,68,68)',
            borderWidth: 1,
            stack: 's',
          },
        ],
      },
      categories: ['Successful requests', 'Errors'],
      colors: ['rgb(59,130,246)', 'rgb(239,68,68)'],
      summary: [
        { name: 'Successful requests', total: 23450, color: 'bg-blue-500' },
        { name: 'Errors', total: 1397, color: 'bg-red-500' },
      ],
    },
    {
      name: 'Projects',
      data: this.makeStacked(
        ['rgb(59,130,246)', 'rgb(6,182,212)', 'rgb(139,92,246)'],
        this.labels,
        ['Online shop', 'Blog', 'Test project'],
      ),
      categories: ['Online shop', 'Blog', 'Test project'],
      colors: ['rgb(59,130,246)', 'rgb(6,182,212)', 'rgb(139,92,246)'],
      summary: [
        { name: 'Online shop', total: 23450, color: 'bg-blue-500' },
        { name: 'Blog', total: 1397, color: 'bg-cyan-500' },
        { name: 'Test project', total: 1397, color: 'bg-violet-500' },
      ],
    },
  ];

  readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }) => {
          this.tooltip = tooltip as TooltipModel<'bar'>;
          this.cdr.markForCheck();
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { display: true, color: '#66666650' },
        ticks: { display: true },
        border: { display: false },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth)
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }
}
