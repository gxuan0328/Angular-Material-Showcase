/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/with-multiple-item-types`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NgClass, NgOptimizedImage } from '@angular/common';

interface User {
  name: string;
  avatar?: string;
}

interface ActivityItem {
  id: string;
  type: 'comment' | 'assignment' | 'tag';
  user: User;
  timestamp: string;
  content?: string;
  assignedTo?: User;
  tags?: { label: string; color: string }[];
}

@Component({
  selector: 'ngm-dev-block-with-multiple-item-types',
  templateUrl: './with-multiple-item-types.component.html',
  imports: [MatIconModule, MatChipsModule, NgClass, NgOptimizedImage],
})
export class WithMultipleItemTypesComponent {
  activities: ActivityItem[] = [
    {
      id: '1',
      type: 'comment',
      user: {
        name: 'Alex Chen',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      },
      timestamp: '3d ago',
      content:
        'Just reviewed the latest design mockups. The new color palette really brings life to the interface. We should consider adding more micro-interactions to enhance user engagement.',
    },
    {
      id: '2',
      type: 'assignment',
      user: {
        name: 'Sarah Miller',
        avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
      },
      timestamp: '12h ago',
      assignedTo: {
        name: 'Marcus Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
    },
    {
      id: '3',
      type: 'tag',
      user: {
        name: 'Rachel Torres',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      },
      timestamp: '1h ago',
      tags: [
        { label: 'Enhancement', color: 'error' },
        { label: 'Performance', color: 'secondary' },
      ],
    },
    {
      id: '4',
      type: 'comment',
      user: {
        name: 'David Park',
        avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
      },
      timestamp: '30m ago',
      content:
        'The latest performance optimizations have shown significant improvements in load times. Our metrics indicate a 40% reduction in initial page load. Great work everyone!',
    },
  ];
}
