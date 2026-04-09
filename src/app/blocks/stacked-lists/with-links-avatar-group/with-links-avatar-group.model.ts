/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/with-links-avatar-group`
*/

export type WithLinksAvatarGroupContact = {
  id: string;
  name: string;
  avatarImageList: string[];
  lastSeen: string;
  title: string;
  count: number;
  resolved: boolean;
};

export const withLinksAvatarGroupContacts: WithLinksAvatarGroupContact[] = [
  {
    id: '1',
    name: 'Leslie Alexander',
    avatarImageList: [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
      'https://i.pravatar.cc/150?img=4',
      'https://i.pravatar.cc/150?img=5',
    ],
    lastSeen: '3h ago',
    title: 'Atque perspiciatis et et aut ut porro voluptatem blanditiis?',
    count: 24,
    resolved: false,
  },
  {
    id: '2',
    name: 'Michael Foster',
    avatarImageList: [
      'https://i.pravatar.cc/150?img=6',
      'https://i.pravatar.cc/150?img=7',
      'https://i.pravatar.cc/150?img=8',
    ],
    lastSeen: '2d ago',
    title: 'Et ratione distinctio nesciunt recusandae vel ab?',
    count: 6,
    resolved: false,
  },
  {
    id: '3',
    name: 'Dries Vincent',
    avatarImageList: [
      'https://i.pravatar.cc/150?img=9',
      'https://i.pravatar.cc/150?img=10',
      'https://i.pravatar.cc/150?img=11',
      'https://i.pravatar.cc/150?img=12',
    ],
    lastSeen: '3d ago',
    title: 'Blanditiis perferendis fugiat optio dolor minus ut?',
    count: 22,
    resolved: true,
  },
  {
    id: '4',
    name: 'Lindsay Walton',
    avatarImageList: [
      'https://i.pravatar.cc/150?img=13',
      'https://i.pravatar.cc/150?img=14',
    ],
    lastSeen: '5d ago',
    title: 'Voluptatum ducimus voluptatem qui in eum quasi consequatur vel?',
    count: 8,
    resolved: true,
  },
  {
    id: '5',
    name: 'Courtney Henry',
    avatarImageList: [
      'https://i.pravatar.cc/150?img=15',
      'https://i.pravatar.cc/150?img=16',
      'https://i.pravatar.cc/150?img=17',
      'https://i.pravatar.cc/150?img=18',
    ],
    lastSeen: '5d ago',
    title: 'Perferendis cum qui inventore ut excepturi nostrum occaecati?',
    count: 15,
    resolved: false,
  },
];
