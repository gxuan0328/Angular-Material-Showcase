/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-2`
*/

export type MemberDetail = {
  type: string;
  value: string;
};

export type Member = {
  name: string;
  initial: string;
  email: string;
  textColor: string;
  bgColor: string;
  href: string;
  details: MemberDetail[];
};

export const members: Member[] = [
  {
    name: 'Alissia Stone',
    initial: 'AS',
    textColor: 'text-fuchsia-800 dark:text-fuchsia-500',
    bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-500/20',
    email: 'a.stone@gmail.com',
    href: '#',
    details: [
      {
        type: 'Role',
        value: 'member',
      },
      {
        type: 'Last active',
        value: '2d ago',
      },
    ],
  },
  {
    name: 'Emma Bern',
    initial: 'EB',
    textColor: 'text-blue-800 dark:text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-500/20',
    email: 'e.bern@gmail.com',
    href: '#',
    details: [
      {
        type: 'Role',
        value: 'member',
      },
      {
        type: 'Last active',
        value: '1d ago',
      },
    ],
  },
  {
    name: 'Aaron McFlow',
    initial: 'AM',
    textColor: 'text-pink-800 dark:text-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-500/20',
    email: 'a.flow@acme.com',
    href: '#',
    details: [
      {
        type: 'Role',
        value: 'admin',
      },
      {
        type: 'Last active',
        value: '2min ago',
      },
    ],
  },
  {
    name: 'Thomas Palstein',
    initial: 'TP',
    textColor: 'text-emerald-800 dark:text-emerald-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/20',
    email: 't.palstein@acme.com',
    href: '#',
    details: [
      {
        type: 'Role',
        value: 'admin',
      },
      {
        type: 'Last active',
        value: '18min ago',
      },
    ],
  },
  {
    name: 'Sarah Johnson',
    initial: 'SJ',
    textColor: 'text-orange-800 dark:text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-500/20',
    email: 's.johnson@gmail.com',
    href: '#',
    details: [
      {
        type: 'Role',
        value: 'member',
      },
      {
        type: 'Last active',
        value: '3h ago',
      },
    ],
  },
  {
    name: 'David Smith',
    initial: 'DS',
    textColor: 'text-indigo-800 dark:text-indigo-500',
    bgColor: 'bg-indigo-100 dark:bg-indigo-500/20',
    email: 'd.smith@gmail.com',
    href: '#',
    details: [
      {
        type: 'Role',
        value: 'guest',
      },
      {
        type: 'Last active',
        value: '4h ago',
      },
    ],
  },
  {
    name: 'Megan Brown',
    initial: 'MB',
    textColor: 'text-yellow-800 dark:text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-500/20',
    email: 'm.brown@gmail.com',
    href: '#',
    details: [
      {
        type: 'Role',
        value: 'admin',
      },
      {
        type: 'Last active',
        value: '1d ago',
      },
    ],
  },
];
