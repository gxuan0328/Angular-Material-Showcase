/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-8`
*/

export type Integration = {
  name: string;
  description: string;
  installations: number;
  icon: string;
  href: string;
  isHomeBuilt: boolean;
  status: 'live' | 'coming soon';
};

export const integrations: Integration[] = [
  {
    name: 'Google Drive',
    description: 'Automate your file upload workflow',
    installations: 983,
    icon: 'brand-gdrive',
    href: '#',
    isHomeBuilt: true,
    status: 'live',
  },
  {
    name: 'Facebook Ads',
    description: 'Analayze ad performance directly in your workspace',
    installations: 461,
    icon: 'brand-facebook',
    href: '#',
    isHomeBuilt: false,
    status: 'live',
  },
  {
    name: 'Notion',
    description: 'Create, manage and sync documentation',
    installations: 719,
    icon: 'brand-notion',
    href: '#',
    isHomeBuilt: true,
    status: 'live',
  },
  {
    name: 'Slack',
    description: 'Sent alerts and workspace updates to your slack account',
    installations: 889,
    icon: 'brand-slack',
    href: '#',
    isHomeBuilt: false,
    status: 'live',
  },
  {
    name: 'Dropbox',
    description: 'Automate your file upload workflow',
    installations: 199,
    icon: 'brand-dropbox',
    href: '#',
    isHomeBuilt: false,
    status: 'coming soon',
  },
];
