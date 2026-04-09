/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update status-monitoring/status-monitoring-10`
*/

import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TrackerComponent } from '../../components/tracker/tracker.component';
import { TrackerBlockProps } from '../../components/tracker/tracker.model';

type Status = 'Operational' | 'Downtime' | 'Maintenance';

const colorMapping: Record<Status, string> = {
  Operational: 'bg-emerald-600',
  Downtime: 'bg-red-600',
  Maintenance: 'bg-amber-600',
};

@Component({
  selector: 'ngm-dev-block-status-monitoring-10',
  imports: [MatCard, MatCardContent, MatIcon, TrackerComponent],
  templateUrl: './status-monitoring-10.component.html',
})
export class StatusMonitoring10Component {
  private readonly data: Array<{
    tooltip: string;
    status: Status;
    description?: string;
  }> = [
    { tooltip: '15 Jan, 2025', status: 'Operational' },
    { tooltip: '16 Jan, 2025', status: 'Operational' },
    { tooltip: '17 Jan, 2025', status: 'Operational' },
    {
      tooltip: '18 Jan, 2025',
      status: 'Downtime',
      description:
        'Down for 9 hours and 14 minutes. Learn more in status report.',
    },
    { tooltip: '19 Jan, 2025', status: 'Operational' },
    { tooltip: '20 Jan, 2025', status: 'Operational' },
    { tooltip: '21 Jan, 2025', status: 'Operational' },
    { tooltip: '22 Jan, 2025', status: 'Operational' },
    { tooltip: '23 Jan, 2025', status: 'Operational' },
    { tooltip: '24 Jan, 2025', status: 'Operational' },
    { tooltip: '25 Jan, 2025', status: 'Operational' },
    { tooltip: '26 Jan, 2025', status: 'Operational' },
    { tooltip: '27 Jan, 2025', status: 'Operational' },
    { tooltip: '28 Jan, 2025', status: 'Operational' },
    { tooltip: '29 Jan, 2025', status: 'Operational' },
    { tooltip: '30 Jan, 2025', status: 'Operational' },
    { tooltip: '31 Jan, 2025', status: 'Operational' },
    { tooltip: '1 Feb, 2025', status: 'Operational' },
    { tooltip: '2 Feb, 2025', status: 'Operational' },
    { tooltip: '3 Feb, 2025', status: 'Operational' },
    { tooltip: '4 Feb, 2025', status: 'Operational' },
    { tooltip: '5 Feb, 2025', status: 'Operational' },
    { tooltip: '6 Feb, 2025', status: 'Operational' },
    { tooltip: '7 Feb, 2025', status: 'Operational' },
    { tooltip: '8 Feb, 2025', status: 'Operational' },
    { tooltip: '9 Feb, 2025', status: 'Operational' },
    { tooltip: '10 Feb, 2025', status: 'Operational' },
    { tooltip: '11 Feb, 2025', status: 'Operational' },
    { tooltip: '12 Feb, 2025', status: 'Operational' },
    { tooltip: '13 Feb, 2025', status: 'Operational' },
    { tooltip: '14 Feb, 2025', status: 'Operational' },
    { tooltip: '15 Feb, 2025', status: 'Operational' },
    {
      tooltip: '16 Feb, 2025',
      status: 'Downtime',
      description:
        'Down for 3 hours and 10 minutes. Learn more in status report.',
    },
    { tooltip: '17 Feb, 2025', status: 'Downtime' },
    { tooltip: '18 Feb, 2025', status: 'Operational' },
    { tooltip: '19 Feb, 2025', status: 'Operational' },
    { tooltip: '20 Feb, 2025', status: 'Operational' },
    { tooltip: '21 Feb, 2025', status: 'Operational' },
    { tooltip: '22 Feb, 2025', status: 'Operational' },
    {
      tooltip: '23 Feb, 2025',
      status: 'Downtime',
      description:
        'Down for 9 hours and 14 minutes. Learn more in status report.',
    },
    { tooltip: '24 Feb, 2025', status: 'Operational' },
    { tooltip: '25 Feb, 2025', status: 'Operational' },
    { tooltip: '26 Feb, 2025', status: 'Operational' },
    { tooltip: '27 Feb, 2025', status: 'Operational' },
    { tooltip: '28 Feb, 2025', status: 'Operational' },
    { tooltip: '1 Mar, 2025', status: 'Operational' },
    { tooltip: '2 Mar, 2025', status: 'Operational' },
    { tooltip: '3 Mar, 2025', status: 'Operational' },
    { tooltip: '4 Mar, 2025', status: 'Operational' },
    { tooltip: '5 Mar, 2025', status: 'Operational' },
    { tooltip: '6 Mar, 2025', status: 'Operational' },
    { tooltip: '7 Mar, 2025', status: 'Operational' },
    { tooltip: '8 Mar, 2025', status: 'Operational' },
    { tooltip: '9 Mar, 2025', status: 'Operational' },
    { tooltip: '10 Mar, 2025', status: 'Operational' },
    { tooltip: '11 Mar, 2025', status: 'Operational' },
    { tooltip: '12 Mar, 2025', status: 'Operational' },
    { tooltip: '13 Mar, 2025', status: 'Operational' },
    { tooltip: '14 Mar, 2025', status: 'Operational' },
    { tooltip: '15 Mar, 2025', status: 'Operational' },
    { tooltip: '16 Mar, 2025', status: 'Operational' },
    { tooltip: '17 Mar, 2025', status: 'Operational' },
    { tooltip: '18 Mar, 2025', status: 'Operational' },
    {
      tooltip: '19 Mar, 2025',
      status: 'Downtime',
      description:
        'Down for 9 hours and 14 minutes. Learn more in status report.',
    },
    { tooltip: '20 Mar, 2025', status: 'Operational' },
    { tooltip: '21 Mar, 2025', status: 'Operational' },
    { tooltip: '22 Mar, 2025', status: 'Operational' },
    { tooltip: '23 Mar, 2025', status: 'Operational' },
    { tooltip: '24 Mar, 2025', status: 'Operational' },
    { tooltip: '25 Mar, 2025', status: 'Operational' },
    { tooltip: '26 Mar, 2025', status: 'Operational' },
    { tooltip: '27 Mar, 2025', status: 'Operational' },
    { tooltip: '28 Mar, 2025', status: 'Operational' },
    { tooltip: '29 Mar, 2025', status: 'Operational' },
    { tooltip: '30 Mar, 2025', status: 'Operational' },
    { tooltip: '31 Mar, 2025', status: 'Operational' },
    { tooltip: '1 Apr, 2025', status: 'Operational' },
    { tooltip: '2 Apr, 2025', status: 'Operational' },
    { tooltip: '3 Apr, 2025', status: 'Operational' },
    { tooltip: '4 Apr, 2025', status: 'Operational' },
    { tooltip: '5 Apr, 2025', status: 'Operational' },
    { tooltip: '6 Apr, 2025', status: 'Operational' },
    {
      tooltip: '7 Apr, 2025',
      status: 'Downtime',
      description:
        'Down for 9 hours and 14 minutes. Learn more in status report.',
    },
    { tooltip: '8 Apr, 2025', status: 'Downtime' },
    { tooltip: '9 Apr, 2025', status: 'Operational' },
    { tooltip: '10 Apr, 2025', status: 'Operational' },
    { tooltip: '11 Apr, 2025', status: 'Operational' },
    { tooltip: '12 Apr, 2025', status: 'Operational' },
    { tooltip: '13 Apr, 2025', status: 'Operational' },
    { tooltip: '14 Apr, 2025', status: 'Operational' },
  ];

  private mapData(data: typeof this.data): TrackerBlockProps[] {
    return data.map((item) => ({
      tooltip: item.tooltip,
      color: colorMapping[item.status],
      data: {
        status: item.status,
        description: item.description,
      },
    }));
  }

  readonly trackerData = this.mapData(this.data);
  readonly trackerDataMedium = this.mapData(this.data.slice(30, 90));
  readonly trackerDataSmall = this.mapData(this.data.slice(60, 90));
}
