/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/table-with-chart`
*/

import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export interface TableWithChartItem {
  workspace: string;
  description?: string;
  owner: string;
  status: string;
  costs: string;
  region: string;
  capacity: string;
  lastEdited: string;
  apiRequests: ChartConfiguration<'line'>['data'];
}

const TABLE_WITH_CHART_DATA: TableWithChartItem[] = [
  {
    workspace: 'sales_by_day_api',
    owner: 'John Doe',
    status: 'Live',
    costs: '$3,509.00',
    region: 'US-West 1',
    capacity: '31.1%',
    lastEdited: '23/09/2023 13:00',
    apiRequests: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          data: [65, 59, 80, 81, 56, 55, 40],
          label: 'API requests',
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
  {
    workspace: 'marketing_campaign',
    owner: 'Jane Smith',
    status: 'Live',
    costs: '$5,720.00',
    region: 'US-East 2',
    capacity: '81.3%',
    lastEdited: '22/09/2023 10:45',
    apiRequests: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          data: [28, 48, 40, 19, 86, 27, 90],
          label: 'API requests',
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
  {
    workspace: 'test_environment',
    owner: 'David Clark',
    status: 'Inactive',
    costs: '$800.00',
    region: 'EU-Central 1',
    capacity: '40.8%',
    lastEdited: '25/09/2023 16:20',
    apiRequests: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          data: [180, 480, 770, 90, 1000, 270, 400],
          label: 'API requests',
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
  {
    workspace: 'sales_campaign',
    owner: 'Emma Stone',
    status: 'Downtime',
    costs: '$5,720.00',
    region: 'US-East 2',
    capacity: '51.4%',
    lastEdited: '22/09/2023 10:45',
    apiRequests: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          data: [90, 100, 110, 120, 130, 140, 150],
          label: 'API requests',
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
  {
    workspace: 'development_env',
    owner: 'Mike Johnson',
    status: 'Inactive',
    costs: '$4,200.00',
    region: 'EU-West 1',
    capacity: '60.4%',
    lastEdited: '21/09/2023 14:30',
    apiRequests: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          data: [56, 55, 40, 19, 86, 27, 90],
          label: 'API requests',
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
  {
    workspace: 'new_workspace_1',
    description: 'Test workspace of Emma Stone',
    owner: 'Alice Brown',
    status: 'Inactive',
    costs: '$2,100.00',
    region: 'US-West 2',
    capacity: '75.9%',
    lastEdited: '24/09/2023 09:15',
    apiRequests: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          data: [24, 23, 22, 21, 20, 19, 18],
          label: 'API requests',
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
];

@Component({
  selector: 'ngm-dev-block-table-with-chart',
  templateUrl: './table-with-chart.component.html',
  imports: [MatTableModule, MatButton, BaseChartDirective],
})
export class TableWithChartComponent {
  columns: {
    label: string;
    value: string;
    tdClass?: string;
    thClass?: string;
  }[] = [
    { label: 'Workspace', value: 'workspace', tdClass: 'font-medium' },
    { label: 'Owner', value: 'owner' },
    { label: 'Status', value: 'status' },
    { label: 'Region', value: 'region' },
    { label: 'Capacity', value: 'capacity' },
    {
      label: 'Costs',
      value: 'costs',
      tdClass: 'text-right!',
      thClass: 'text-right!',
    },
    {
      label: 'Last Edited',
      value: 'lastEdited',
      tdClass: 'text-right!',
      thClass: 'text-right!',
    },
    {
      label: 'API requests',
      value: 'apiRequests',
      thClass: 'text-right!',
      tdClass: 'h-18! flex justify-end items-center',
    },
  ];
  displayedColumns = this.columns.map((column) => column.value);
  dataSource = TABLE_WITH_CHART_DATA;
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    layout: {
      padding: {
        left: 0, // Set to 0 to remove left padding
        right: 0, // Set to 0 to remove right padding
        top: 0, // Set to 0 to remove top padding
        bottom: 0, // Set to 0 to remove bottom padding
      },
    },
  };
}
