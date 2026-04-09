/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-select-table`
*/

import { Component, computed, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

export interface FilterSelectTableItem {
  workspace: string;
  description?: string;
  owner: string;
  status: string;
  costs: string;
  region: string;
  capacity: string;
  lastEdited: string;
}

const FILTER_SELECT_TABLE_DATA: FilterSelectTableItem[] = [
  {
    workspace: 'sales_by_day_api',
    owner: 'John Doe',
    status: 'Live',
    costs: '$3,509.00',
    region: 'US-West 1',
    capacity: '31.1%',
    lastEdited: '23/09/2023 13:00',
  },
  {
    workspace: 'marketing_campaign',
    owner: 'Jane Smith',
    status: 'Live',
    costs: '$5,720.00',
    region: 'US-East 2',
    capacity: '81.3%',
    lastEdited: '22/09/2023 10:45',
  },
  {
    workspace: 'test_environment',
    owner: 'David Clark',
    status: 'Inactive',
    costs: '$800.00',
    region: 'EU-Central 1',
    capacity: '40.8%',
    lastEdited: '25/09/2023 16:20',
  },
  {
    workspace: 'sales_campaign',
    owner: 'Emma Stone',
    status: 'Downtime',
    costs: '$5,720.00',
    region: 'US-East 2',
    capacity: '51.4%',
    lastEdited: '22/09/2023 10:45',
  },
  {
    workspace: 'development_env',
    owner: 'Mike Johnson',
    status: 'Inactive',
    costs: '$4,200.00',
    region: 'EU-West 1',
    capacity: '60.4%',
    lastEdited: '21/09/2023 14:30',
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
  },
];

@Component({
  selector: 'ngm-dev-block-filter-select-table',
  templateUrl: './filter-select-table.component.html',
  imports: [
    MatTableModule,
    MatSelect,
    MatOption,
    FormsModule,
    MatFormField,
    MatLabel,
    MatCard,
    MatCardContent,
    MatIcon,
  ],
})
export class FilterSelectTableComponent {
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
      label: 'Last Edited',
      value: 'lastEdited',
      tdClass: 'text-right!',
      thClass: 'text-right!',
    },
    {
      label: 'Costs',
      value: 'costs',
      tdClass: 'text-right!',
      thClass: 'text-right!',
    },
  ];
  displayedColumns = this.columns.map((column) => column.value);
  statusFilter = model('All');
  ownerFilter = model('All');
  dataSource = computed(() => {
    return FILTER_SELECT_TABLE_DATA.filter((item) => {
      return (
        (this.statusFilter() === 'All' ||
          item.status === this.statusFilter()) &&
        (this.ownerFilter() === 'All' || item.owner === this.ownerFilter())
      );
    });
  });

  filterSelectList: {
    label: string;
    options: { label: string; value: string }[];
    ngModel: ModelSignal<string>;
  }[] = [
    {
      label: 'Status',
      // get unique statuses from dataSource
      options: [
        {
          label: 'All',
          value: 'All',
        },
        ...[
          ...new Set(FILTER_SELECT_TABLE_DATA.map((item) => item.status)),
        ].map((status) => ({
          label: status,
          value: status,
        })),
      ],
      ngModel: this.statusFilter,
    },
    {
      label: 'Owner',
      // get unique owners from dataSource
      options: [
        {
          label: 'All',
          value: 'All',
        },
        ...[...new Set(FILTER_SELECT_TABLE_DATA.map((item) => item.owner))].map(
          (owner) => ({
            label: owner,
            value: owner,
          }),
        ),
      ],
      ngModel: this.ownerFilter,
    },
  ];
}
