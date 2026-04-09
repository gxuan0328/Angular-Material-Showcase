/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/full-width-avatar-table`
*/

import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChip, MatChipSet } from '@angular/material/chips';

export interface FullWidthAvatarTableItem {
  user: {
    name: string;
    avatar: string;
  };
  commit: {
    hash: string;
    branch: string;
  };
  status: 'completed' | 'error';
  duration: string; // 25s, 1m 32s, etc.
  deployedAt: string; // 45 minutes ago, 1 hour ago, 2 days ago, etc.
}

const ITEMS: FullWidthAvatarTableItem[] = [
  {
    user: {
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    commit: {
      hash: 'a1b2c3d4e5',
      branch: 'main',
    },
    status: 'completed',
    duration: '35s',
    deployedAt: '2 minutes ago',
  },
  {
    user: {
      name: 'Bob Williams',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    commit: {
      hash: 'f6g7h8i9j0',
      branch: 'feature/auth-fix',
    },
    status: 'error',
    duration: '1m 10s',
    deployedAt: '15 minutes ago',
  },
  {
    user: {
      name: 'Charlie Brown',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    commit: {
      hash: 'k1l2m3n4o5',
      branch: 'develop',
    },
    status: 'completed',
    duration: '48s',
    deployedAt: '1 hour ago',
  },
  {
    user: {
      name: 'Diana Prince',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    commit: {
      hash: 'p6q7r8s9t0',
      branch: 'main',
    },
    status: 'completed',
    duration: '28s',
    deployedAt: '3 hours ago',
  },
  {
    user: {
      name: 'Eve Adams',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    commit: {
      hash: 'u1v2w3x4y5',
      branch: 'feature/payment-gateway',
    },
    status: 'error',
    duration: '2m 5s',
    deployedAt: 'Yesterday',
  },
  {
    user: {
      name: 'Frank White',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    commit: {
      hash: 'z6a7b8c9d0',
      branch: 'main',
    },
    status: 'completed',
    duration: '55s',
    deployedAt: '2 days ago',
  },
  {
    user: {
      name: 'Grace Lee',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    commit: {
      hash: 'e1f2g3h4i5',
      branch: 'hotfix/critical-bug',
    },
    status: 'completed',
    duration: '40s',
    deployedAt: '5 days ago',
  },
  {
    user: {
      name: 'Harry Potter',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    commit: {
      hash: 'j6k7l8m9n0',
      branch: 'develop',
    },
    status: 'completed',
    duration: '1m 15s',
    deployedAt: '1 week ago',
  },
  {
    user: {
      name: 'Ivy Chen',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    commit: {
      hash: 'o1p2q3r4s5',
      branch: 'feature/dashboard-updates',
    },
    status: 'error',
    duration: '1m 45s',
    deployedAt: '2 weeks ago',
  },
  {
    user: {
      name: 'Jack Sparrow',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    commit: {
      hash: 't6u7v8w9x0',
      branch: 'main',
    },
    status: 'completed',
    duration: '30s',
    deployedAt: '3 weeks ago',
  },
];

@Component({
  selector: 'ngm-dev-block-full-width-avatar-table',
  templateUrl: './full-width-avatar-table.component.html',
  styleUrls: ['./full-width-avatar-table.component.scss'],
  imports: [MatTableModule, MatChipSet, MatChip],
})
export class FullWidthAvatarTableComponent {
  displayedColumns: string[] = [
    'user',
    'commit',
    'status',
    'duration',
    'deployedAt',
  ];
  dataSource = ITEMS;
}
