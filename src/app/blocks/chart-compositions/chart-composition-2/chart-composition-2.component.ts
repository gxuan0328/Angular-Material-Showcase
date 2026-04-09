/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-2`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardHeader,
  MatCardContent,
  MatCardSubtitle,
} from '@angular/material/card';
import { ChartData, TooltipModel } from 'chart.js';
import { MatFormField, MatSelect, MatOption } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { hoverSegmentPlugin } from '../../utils/constants/chart-plugins';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';

const ISSUE_OPEND_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Zm9.5 2a2 2 0 1 1-.001-3.999A2 2 0 0 1 12 14Z"></path></svg>';
const PULL_REQUEST_OPENED_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M16 19.25a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm-14.5 0a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm0-14.5a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM4.75 3a1.75 1.75 0 1 0 .001 3.501A1.75 1.75 0 0 0 4.75 3Zm0 14.5a1.75 1.75 0 1 0 .001 3.501A1.75 1.75 0 0 0 4.75 17.5Zm14.5 0a1.75 1.75 0 1 0 .001 3.501 1.75 1.75 0 0 0-.001-3.501Z"></path><path d="M13.405 1.72a.75.75 0 0 1 0 1.06L12.185 4h4.065A3.75 3.75 0 0 1 20 7.75v8.75a.75.75 0 0 1-1.5 0V7.75a2.25 2.25 0 0 0-2.25-2.25h-4.064l1.22 1.22a.75.75 0 0 1-1.061 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0ZM4.75 7.25A.75.75 0 0 1 5.5 8v8A.75.75 0 0 1 4 16V8a.75.75 0 0 1 .75-.75Z"></path></svg>';
const MERGED_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15 13.25a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm-12.5 6a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm0-14.5a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM5.75 6.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 6.5Zm0 14.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 21Zm12.5-6a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 18.25 15Z"></path><path d="M6.5 7.25c0 2.9 2.35 5.25 5.25 5.25h4.5V14h-4.5A6.75 6.75 0 0 1 5 7.25Z"></path><path d="M5.75 16.75A.75.75 0 0 1 5 16V8a.75.75 0 0 1 1.5 0v8a.75.75 0 0 1-.75.75Z"></path></svg>';
const ISSUE_CLOSED_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17.28 9.28a.75.75 0 0 0-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l6.5-6.5Z"></path><path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z"></path></svg>';

type OverviewItem = {
  name: string;
  value: number;
  icon: string;
  iconColor: string;
};

type ContributorItem = {
  username: string;
  contributions: number;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-composition-2',
  templateUrl: './chart-composition-2.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatFormField,
    MatSelect,
    MatOption,
    MatDivider,
    MatIcon,
    CategoryBarComponent,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
  ],
})
export class ChartComposition2Component {
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'bar'> | undefined;
  chartPlugins = [hoverSegmentPlugin];
  constructor() {
    this.matIconRegistry.addSvgIconLiteral(
      'issue_opened',
      this.sanitizer.bypassSecurityTrustHtml(ISSUE_OPEND_ICON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'pull_request_opened',
      this.sanitizer.bypassSecurityTrustHtml(PULL_REQUEST_OPENED_ICON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'merged',
      this.sanitizer.bypassSecurityTrustHtml(MERGED_ICON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'issue_closed',
      this.sanitizer.bypassSecurityTrustHtml(ISSUE_CLOSED_ICON),
    );
  }
  chartType = 'bar' as const;

  overviewData: OverviewItem[] = [
    {
      name: 'Open PRs',
      value: 6,
      icon: 'pull_request_opened',
      iconColor: 'text-blue-600! dark:text-blue-400!',
    },
    {
      name: 'Merged PRs',
      value: 12,
      icon: 'merged',
      iconColor: 'text-emerald-600! dark:text-emerald-400!',
    },
    {
      name: 'Open Issues',
      value: 10,
      icon: 'issue_opened',
      iconColor: 'text-blue-600! dark:text-blue-400!',
    },
    {
      name: 'Closed Issues',
      value: 87,
      icon: 'issue_closed',
      iconColor: 'text-emerald-600! dark:text-emerald-400!',
    },
  ];

  topContributors: ContributorItem[] = [
    {
      username: 'Mbauchet',
      contributions: 9,
    },
    {
      username: 'Pizuronin',
      contributions: 6,
    },
    {
      username: 'Codetrendy',
      contributions: 4,
    },
    {
      username: 'Devsparkle',
      contributions: 4,
    },
    {
      username: 'Techphantom',
      contributions: 3,
    },
  ];

  chartData: ChartData<'bar', number[], string> = {
    labels: this.topContributors.map((c) => c.username),
    datasets: [
      {
        data: this.topContributors.map((c) => c.contributions),
        label: 'Contributions',
        backgroundColor: 'rgb(16, 185, 129)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  chartOptions: CustomChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }) => {
          this.tooltip = tooltip as TooltipModel<'bar'>;
          this.cdr.markForCheck();
        },
      },
      hoverSegment: {
        color: '#66666650',
        indexAxis: 'y',
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        beginAtZero: true,
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'y',
    },
  };

  // Category bar values for Pull Requests (Open: 6, Merged: 12)
  prValues = [6, 12];
  prColors: Array<'blue' | 'emerald'> = ['blue', 'emerald'];

  // Category bar values for Issues (Open: 10, Closed: 87)
  issueValues = [10, 87];
  issueColors: Array<'blue' | 'emerald'> = ['blue', 'emerald'];

  getTooltipTransform(
    caretY: number,
    tooltipHeight: number,
    chartHeight: number,
  ): string {
    let translateY = 0;
    if (caretY + tooltipHeight + TOOLTIP_SPACE >= chartHeight) {
      translateY = caretY - tooltipHeight - TOOLTIP_SPACE;
    } else {
      translateY = caretY + TOOLTIP_SPACE;
    }
    return `translate(50%, ${translateY}px)`;
  }
}
