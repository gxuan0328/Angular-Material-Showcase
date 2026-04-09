/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-5`
*/

export type Integration = {
  name: string;
  description: string;
  icon: string;
  status: 'Connected' | 'Enable';
};

export const integrations: Integration[] = [
  {
    name: 'Google Drive',
    description: 'Automate your file upload workflow',
    icon: 'brand-drive',
    status: 'Connected',
  },
  {
    name: 'Facebook Ads',
    description: 'Analyze ad performance directly in your workspace',
    icon: 'brand-facebook',
    status: 'Enable',
  },
  {
    name: 'Notion',
    description: 'Create, manage and sync documentation',
    icon: 'brand-notion',
    status: 'Enable',
  },
  {
    name: 'Slack',
    description: 'Sent alerts and workspace updates to your slack account',
    icon: 'brand-slack',
    status: 'Connected',
  },
  {
    name: 'Dropbox',
    description: 'Automate your file upload workflow',
    icon: 'brand-dropbox',
    status: 'Enable',
  },
];
