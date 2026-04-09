/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-9`
*/

export type WorkspaceDetailItem = {
  type: string;
  value: string;
};

export type Workspace = {
  name: string;
  icon: string;
  href: string;
  details: WorkspaceDetailItem[];
};

export const workspaces: Workspace[] = [
  {
    name: 'Test Workspace',
    icon: 'stack',
    href: '#',
    details: [
      {
        type: 'Storage',
        value: '5/10GB',
      },
      {
        type: 'Users',
        value: '89/100',
      },
      {
        type: 'Requests',
        value: '995/10K',
      },
      {
        type: 'Status',
        value: 'Live',
      },
    ],
  },
  {
    name: 'BI Workspace',
    icon: 'stack',
    href: '#',
    details: [
      {
        type: 'Storage',
        value: '9.8/10GB',
      },
      {
        type: 'Users',
        value: '23/100',
      },
      {
        type: 'Requests',
        value: '435/10K',
      },
      {
        type: 'Status',
        value: 'Inactive',
      },
    ],
  },
  {
    name: 'Livestream',
    icon: 'stack',
    href: '#',
    details: [
      {
        type: 'Storage',
        value: '5.6/10GB',
      },
      {
        type: 'Users',
        value: '79/100',
      },
      {
        type: 'Requests',
        value: '642/10K',
      },
      {
        type: 'Status',
        value: 'Live',
      },
    ],
  },
  {
    name: 'Prod Workspace',
    icon: 'stack',
    href: '#',
    details: [
      {
        type: 'Storage',
        value: '9.8/10GB',
      },
      {
        type: 'Users',
        value: '23/100',
      },
      {
        type: 'Requests',
        value: '435/10K',
      },
      {
        type: 'Status',
        value: 'Inactive',
      },
    ],
  },
  {
    name: 'Test Pipelines',
    icon: 'stack',
    href: '#',
    details: [
      {
        type: 'Storage',
        value: '5.9/10GB',
      },
      {
        type: 'Users',
        value: '89/100',
      },
      {
        type: 'Requests',
        value: '995/10K',
      },
      {
        type: 'Status',
        value: 'Live',
      },
    ],
  },
];
