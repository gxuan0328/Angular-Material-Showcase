/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-15`
*/

export type CapacityItem = {
  label: string;
  value: number | string;
};

export type Workspace = {
  name: string;
  status: 'active' | 'inactive';
  type: string;
  database: string;
  href: string;
  capacity: CapacityItem[];
};

export type Region = {
  region: string;
  workspaces: Workspace[];
};

export const data: Region[] = [
  {
    region: 'US-East',
    workspaces: [
      {
        name: 'sales_by_day_api',
        status: 'active',
        type: 'Test workspace',
        database: 'live_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 34,
          },
          {
            label: 'storage',
            value: '5/10GB',
          },
          {
            label: 'lastEdited',
            value: '1d ago',
          },
        ],
      },
      {
        name: 'testing_environment_2',
        status: 'inactive',
        type: 'API',
        database: 'test_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 28,
          },
          {
            label: 'storage',
            value: '7.4/10GB',
          },
          {
            label: 'lastEdited',
            value: '2d ago',
          },
        ],
      },
      {
        name: 'training_environment',
        status: 'active',
        type: 'Test workspace',
        database: 'live_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 38,
          },
          {
            label: 'storage',
            value: '3.2/10GB',
          },
          {
            label: 'lastEdited',
            value: '4h ago',
          },
        ],
      },
      {
        name: 'analytics_dashboard',
        status: 'inactive',
        type: 'API',
        database: 'test_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 34,
          },
          {
            label: 'storage',
            value: '5/10GB',
          },
          {
            label: 'lastEdited',
            value: '1d ago',
          },
        ],
      },
      {
        name: 'managed_database_test',
        status: 'active',
        type: 'Test workspace',
        database: 'live_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 39,
          },
          {
            label: 'storage',
            value: '5.9/10GB',
          },
          {
            label: 'lastEdited',
            value: '7d ago',
          },
        ],
      },
    ],
  },
  {
    region: 'US-West',
    workspaces: [
      {
        name: 'testing_lab',
        status: 'active',
        type: 'Report',
        database: 'live_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 27,
          },
          {
            label: 'storage',
            value: '5/10GB',
          },
          {
            label: 'lastEdited',
            value: '1d ago',
          },
        ],
      },
      {
        name: 'research_project_2',
        status: 'inactive',
        type: 'Report',
        database: 'test_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 45,
          },
          {
            label: 'storage',
            value: '6.4/10GB',
          },
          {
            label: 'lastEdited',
            value: '4d ago',
          },
        ],
      },
      {
        name: 'supply_chain_api_month',
        status: 'active',
        type: 'API',
        database: 'live_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 41,
          },
          {
            label: 'storage',
            value: '7.8/10GB',
          },
          {
            label: 'lastEdited',
            value: '1d ago',
          },
        ],
      },
      {
        name: 'test_environment_beta',
        status: 'inactive',
        type: 'Test workspace',
        database: 'test_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 39,
          },
          {
            label: 'storage',
            value: '6.4/10GB',
          },
          {
            label: 'lastEdited',
            value: '2h ago',
          },
        ],
      },
      {
        name: 'private_workspace_test_api',
        status: 'inactive',
        type: 'Test workspace',
        database: 'test_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 31,
          },
          {
            label: 'storage',
            value: '4.1/10GB',
          },
          {
            label: 'lastEdited',
            value: '2d ago',
          },
        ],
      },
    ],
  },
  {
    region: 'EU-Central-1',
    workspaces: [
      {
        name: 'testing_lab',
        status: 'active',
        type: 'API',
        database: 'live_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 24,
          },
          {
            label: 'storage',
            value: '6.1/10GB',
          },
          {
            label: 'lastEdited',
            value: '1h ago',
          },
        ],
      },
      {
        name: 'research_project_2',
        status: 'inactive',
        type: 'Report',
        database: 'test_data',
        href: '#',
        capacity: [
          {
            label: 'users',
            value: 12,
          },
          {
            label: 'storage',
            value: '1.1/10GB',
          },
          {
            label: 'lastEdited',
            value: '3d ago',
          },
        ],
      },
    ],
  },
];

export const capacityIcons: Record<string, string> = {
  users: 'group',
  storage: 'database',
  lastEdited: 'schedule',
};
