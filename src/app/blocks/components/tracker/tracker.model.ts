/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/tracker`
*/

import { TooltipPosition } from '@angular/material/tooltip';

export type TrackerBlockProps<T = unknown> = {
  key?: string | number;
  color?: string;
  tooltip?: string;
  defaultBackgroundColor?: string;
  tooltipPosition?: TooltipPosition;
  data?: T;
};

export const sampleTrackerData: TrackerBlockProps[] = [
  {
    key: 1,
    color: 'bg-emerald-500',
    tooltip: 'Completed tasks: 23',
  },
  {
    key: 2,
    color: 'bg-blue-500',
    tooltip: 'In progress: 12',
  },
  {
    key: 3,
    color: 'bg-yellow-500',
    tooltip: 'Pending review: 8',
  },
  {
    key: 4,
    color: 'bg-red-500',
    tooltip: 'Blocked: 3',
  },
  {
    key: 5,
    color: 'bg-purple-500',
    tooltip: 'Testing: 5',
  },
  {
    key: 6,
    color: 'bg-indigo-500',
    tooltip: 'Deployed: 15',
  },
  {
    key: 7,
    color: 'bg-pink-500',
    tooltip: 'Bug fixes: 7',
  },
  {
    key: 8,
    tooltip: 'No status: 2',
  },
  {
    key: 9,
    color: 'bg-teal-500',
    tooltip: 'Documentation: 4',
  },
  {
    key: 10,
    color: 'bg-orange-500',
    tooltip: 'Feature requests: 6',
  },
];
