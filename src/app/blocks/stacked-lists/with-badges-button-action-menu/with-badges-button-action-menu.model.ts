/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/with-badges-button-action-menu`
*/

export type WithBadgesButtonActionMenuItem = {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'archived';
  dueDate: string;
  createdBy: string;
};

export const withBadgesButtonActionMenuItems: WithBadgesButtonActionMenuItem[] =
  [
    {
      id: '1',
      name: 'GraphQL API',
      status: 'completed',
      dueDate: '2025-07-13',
      createdBy: 'John Doe',
    },
    {
      id: '2',
      name: 'API Documentation',
      status: 'in-progress',
      dueDate: '2025-07-14',
      createdBy: 'Jane Smith',
    },
    {
      id: '3',
      name: 'API Testing',
      status: 'archived',
      dueDate: '2025-07-15',
      createdBy: 'Leslie Alexander',
    },
    {
      id: '4',
      name: 'iOS App',
      status: 'in-progress',
      dueDate: '2025-07-14',
      createdBy: 'Michael Foster',
    },
    {
      id: '5',
      name: 'Android App',
      status: 'archived',
      dueDate: '2025-07-15',
      createdBy: 'Trevor Henderson',
    },
  ];
