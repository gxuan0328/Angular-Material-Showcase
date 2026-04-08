/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update spark-area-charts/spark-area-chart-4`
*/

import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ChartData, ChartConfiguration } from 'chart.js';

type MetricData = {
  date: string;
  'Weekly active users': number;
  'Weekly sessions': number;
  'Weekly user growth': number;
};

type SummaryItem = {
  name: string;
  stat: string;
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-spark-area-chart-4',
  templateUrl: './spark-area-chart-4.component.html',
  imports: [BaseChartDirective, MatCard, MatCardContent],
})
export class SparkAreaChart4Component {
  chartType = 'line' as const;

  data: MetricData[] = [
    {
      date: 'Week 1',
      'Weekly active users': 847,
      'Weekly sessions': 1342,
      'Weekly user growth': 5.2,
    },
    {
      date: 'Week 2',
      'Weekly active users': 923,
      'Weekly sessions': 1456,
      'Weekly user growth': 6.8,
    },
    {
      date: 'Week 3',
      'Weekly active users': 756,
      'Weekly sessions': 1289,
      'Weekly user growth': 4.9,
    },
    {
      date: 'Week 4',
      'Weekly active users': 891,
      'Weekly sessions': 1398,
      'Weekly user growth': 5.7,
    },
    {
      date: 'Week 5',
      'Weekly active users': 1045,
      'Weekly sessions': 1634,
      'Weekly user growth': 7.3,
    },
    {
      date: 'Week 6',
      'Weekly active users': 982,
      'Weekly sessions': 1567,
      'Weekly user growth': 6.1,
    },
    {
      date: 'Week 7',
      'Weekly active users': 1134,
      'Weekly sessions': 1789,
      'Weekly user growth': 8.4,
    },
    {
      date: 'Week 8',
      'Weekly active users': 1267,
      'Weekly sessions': 1923,
      'Weekly user growth': 9.2,
    },
    {
      date: 'Week 9',
      'Weekly active users': 1389,
      'Weekly sessions': 2156,
      'Weekly user growth': 10.1,
    },
    {
      date: 'Week 10',
      'Weekly active users': 1456,
      'Weekly sessions': 2298,
      'Weekly user growth': 10.8,
    },
    {
      date: 'Week 11',
      'Weekly active users': 1523,
      'Weekly sessions': 2445,
      'Weekly user growth': 11.3,
    },
    {
      date: 'Week 12',
      'Weekly active users': 1612,
      'Weekly sessions': 2587,
      'Weekly user growth': 12.1,
    },
  ];

  summary: SummaryItem[] = [
    {
      name: 'Weekly active users',
      stat: '1,612',
      chartData: this.getChartDataForMetric('Weekly active users'),
    },
    {
      name: 'Weekly sessions',
      stat: '2,587',
      chartData: this.getChartDataForMetric('Weekly sessions'),
    },
    {
      name: 'Weekly user growth',
      stat: '12.1%',
      chartData: this.getChartDataForMetric('Weekly user growth'),
    },
  ];

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
      },
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  getChartDataForMetric(
    metricName: string,
  ): ChartData<'line', number[], string> {
    const metricData = this.data.map(
      (item) => item[metricName as keyof MetricData] as number,
    );

    return {
      labels: this.data.map((item) => item.date),
      datasets: [
        {
          data: metricData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }
}
