/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-7`
*/

export type Integration = {
  name: string;
  description: string;
  installations: number;
  icon: string;
  href: string;
};

export const integrations: Integration[] = [
  {
    name: 'Google Drive',
    description: 'Automate your file upload workflow',
    installations: 983,
    icon: 'brand-gdrive',
    href: '#',
  },
  {
    name: 'Facebook Ads',
    description: 'Analyze ad performance directly in your workspace',
    installations: 461,
    icon: 'brand-facebook',
    href: '#',
  },
  {
    name: 'Notion',
    description: 'Create, manage and sync documentation',
    installations: 719,
    icon: 'brand-notion',
    href: '#',
  },
  {
    name: 'Slack',
    description: 'Sent alerts and workspace updates to your slack account',
    installations: 889,
    icon: 'brand-slack',
    href: '#',
  },
  {
    name: 'Dropbox',
    description: 'Automate your file upload workflow',
    installations: 199,
    icon: 'brand-dropbox',
    href: '#',
  },
];
