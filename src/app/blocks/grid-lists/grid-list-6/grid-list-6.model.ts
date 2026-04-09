/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-6`
*/

export type Pipeline = {
  tag: string;
  name: string;
  lastEdited: string;
  status: 'live' | 'inactive';
  type: 'API' | 'materialized';
  href: string;
};

export const pipelines: Pipeline[] = [
  {
    tag: 'pipeline-145',
    name: 'sales_by_channel_per_day_materialized',
    lastEdited: 'Sep 18',
    status: 'live',
    type: 'API',
    href: '#',
  },
  {
    tag: 'pipeline-321',
    name: 'total_sales_api',
    lastEdited: 'Sep 20',
    status: 'live',
    type: 'API',
    href: '#',
  },
  {
    tag: 'pipeline-543',
    name: 'top_products_by_units_sold_api',
    lastEdited: 'Sep 01',
    status: 'inactive',
    type: 'materialized',
    href: '#',
  },
  {
    tag: 'pipeline-002',
    name: 'units_sold_by_location_per_hour_materialized',
    lastEdited: 'Mar 15',
    status: 'live',
    type: 'materialized',
    href: '#',
  },
  {
    tag: 'pipeline-149',
    name: 'top_channels_by_sales_api',
    lastEdited: 'Mar 15',
    status: 'inactive',
    type: 'API',
    href: '#',
  },
  {
    tag: 'pipeline-004',
    name: 'top_locations_by_sales_api',
    lastEdited: "Apr '04",
    status: 'live',
    type: 'API',
    href: '#',
  },
];
