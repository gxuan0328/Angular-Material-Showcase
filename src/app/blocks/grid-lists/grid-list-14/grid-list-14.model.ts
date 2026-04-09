/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-14`
*/

export type Order = {
  item: string;
  company: string;
  location: string;
  contact: string;
  fulfillmentActual: number;
  fulfillmentTotal: number;
  lastUpdated: string;
};

export type OrderCategory = {
  status: string;
  icon: string;
  iconColor: string;
  indicatorColor: string;
  orders: Order[];
};

export const orderCategories: OrderCategory[] = [
  {
    status: 'In progress',
    icon: 'settings',
    iconColor: 'text-blue-500!',
    indicatorColor: 'var(--color-blue-500)',
    orders: [
      {
        item: 'Printer Laser Jet Pro',
        company: 'Big Tech Ltd.',
        location: 'Paris, France',
        contact: 'Lena Stone',
        fulfillmentActual: 8,
        fulfillmentTotal: 10,
        lastUpdated: '2min ago',
      },
      {
        item: 'LED Monitor',
        company: 'Bitclick Holding',
        location: 'Zurich, Switzerland',
        contact: 'Matthias Ruedi',
        fulfillmentActual: 3,
        fulfillmentTotal: 4,
        lastUpdated: '5min ago',
      },
      {
        item: 'Conference Speaker',
        company: 'Cornerstone LLC',
        location: 'Frankfurt, Germany',
        contact: 'David Mueller',
        fulfillmentActual: 2,
        fulfillmentTotal: 4,
        lastUpdated: '10d ago',
      },
    ],
  },
  {
    status: 'Delivering',
    icon: 'local_shipping',
    iconColor: 'text-emerald-500!',
    indicatorColor: 'var(--color-emerald-500)',
    orders: [
      {
        item: 'OLED 49" Monitor',
        company: 'Walders AG',
        location: 'St. Gallen, Switzerland',
        contact: 'Patrick Doe',
        fulfillmentActual: 5,
        fulfillmentTotal: 6,
        lastUpdated: '4d ago',
      },
      {
        item: 'Portable Power Station',
        company: 'Lake View GmbH',
        location: 'Lucerne, Switzerland',
        contact: 'Marco Smith',
        fulfillmentActual: 5,
        fulfillmentTotal: 8,
        lastUpdated: '1d ago',
      },
      {
        item: 'Office headset (Wireless)',
        company: 'Cornerstone LLC',
        location: 'St. Anton, Austria',
        contact: 'Peter Batt',
        fulfillmentActual: 1,
        fulfillmentTotal: 2,
        lastUpdated: '7d ago',
      },
      {
        item: 'Smart Home Security System',
        company: 'SecureTech Solutions AG',
        location: 'Munich, Germany',
        contact: 'Thomas Schneider',
        fulfillmentActual: 3,
        fulfillmentTotal: 4,
        lastUpdated: '2h ago',
      },
      {
        item: 'Gaming Laptop Super Screen 14"',
        company: 'Tech Master Ltd.',
        location: 'Aspen, USA',
        contact: 'Joe Ross',
        fulfillmentActual: 9,
        fulfillmentTotal: 10,
        lastUpdated: '1h ago',
      },
    ],
  },
  {
    status: 'Delayed',
    icon: 'schedule',
    iconColor: 'text-orange-500!',
    indicatorColor: 'var(--color-orange-500)',
    orders: [
      {
        item: 'External SSD Portable',
        company: 'Waterbridge Associates Inc.',
        location: 'New York, USA',
        contact: 'Adam Taylor',
        fulfillmentActual: 4,
        fulfillmentTotal: 12,
        lastUpdated: '1d ago',
      },
      {
        item: 'Portable Scanner V600',
        company: 'Hotel Stars GmbH',
        location: 'Chur, Switzerland',
        contact: 'Elias Jones',
        fulfillmentActual: 5,
        fulfillmentTotal: 10,
        lastUpdated: '4d ago',
      },
    ],
  },
];

export function getStatusColor(status: string): string {
  const statusColor: Record<string, string> = {
    'In progress':
      'bg-blue-50! text-blue-700 ring-blue-600/20 dark:bg-blue-400/10! dark:text-blue-400 dark:ring-blue-400/20',
    Delivering:
      'bg-emerald-50! text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10! dark:text-emerald-400 dark:ring-emerald-400/20',
    Delayed:
      'bg-orange-50! text-orange-700 ring-orange-600/20 dark:bg-orange-400/10! dark:text-orange-400 dark:ring-orange-400/20',
  };

  return (
    statusColor[status] ||
    'bg-gray-50! text-gray-700 ring-gray-600/20 dark:bg-gray-400/10! dark:text-gray-400 dark:ring-gray-400/20'
  );
}
