/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/onboarding-feed-5`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { AvvvatarsComponent } from '@ngxpert/avvvatars';

interface TimelineEvent {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  timestamp: string;
}

@Component({
  selector: 'ngm-dev-block-onboarding-feed-5',
  templateUrl: './onboarding-feed-5.component.html',
  imports: [MatIconModule, MatButtonModule, NgClass, AvvvatarsComponent],
})
export class OnboardingFeed5Component {
  events: TimelineEvent[] = [
    {
      id: 1,
      user: {
        name: 'Sarah M.',
        avatar: 'SM',
      },
      action: 'Created Workspace',
      timestamp: '3d ago',
    },
    {
      id: 2,
      user: {
        name: 'David R.',
        avatar: 'DR',
      },
      action: 'Renamed workspace',
      timestamp: '2d ago',
    },
    {
      id: 3,
      user: {
        name: 'Sarah M.',
        avatar: 'SM',
      },
      action: 'Added PostgreSQL database to workspace',
      timestamp: '2h ago',
    },
    {
      id: 4,
      user: {
        name: 'Michael K.',
        avatar: 'MK',
      },
      action: 'Changed access permission to private',
      timestamp: '5min ago',
    },
    {
      id: 5,
      user: {
        name: 'System',
        avatar: '🤖',
      },
      action: 'Has to run audit trails',
      timestamp: 'today 2:30pm',
    },
  ];

  getAvatarColor(name: string): string {
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-pink-100 text-pink-800',
      'bg-amber-100 text-amber-800',
    ];
    return colors[Math.abs(name.charCodeAt(0)) % colors.length];
  }
}
