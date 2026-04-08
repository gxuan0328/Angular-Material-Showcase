/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/with-comments`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

interface ActivityItem {
  id: string;
  type: 'created' | 'edited' | 'sent' | 'commented' | 'viewed' | 'paid';
  action: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  comment?: string;
}

@Component({
  selector: 'ngm-dev-block-with-comments',
  templateUrl: './with-comments.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    NgOptimizedImage,
    MatMenuModule,
  ],
})
export class WithCommentsComponent {
  activities: ActivityItem[] = [
    {
      id: '1',
      type: 'created',
      action: 'created the invoice.',
      user: {
        name: 'Isabella Kim',
      },
      timestamp: '3d ago',
    },
    {
      id: '2',
      type: 'edited',
      action: 'edited the invoice.',
      user: {
        name: 'Isabella Kim',
      },
      timestamp: '2d ago',
    },
    {
      id: '3',
      type: 'sent',
      action: 'sent the invoice.',
      user: {
        name: 'Isabella Kim',
      },
      timestamp: '2d ago',
    },
    {
      id: '4',
      type: 'commented',
      action: 'commented',
      user: {
        name: 'Isabella Kim',
        avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
      },
      timestamp: '1d ago',
      comment:
        'Just got off a call with the client. They confirmed the payment will be processed by end of week.',
    },
    {
      id: '5',
      type: 'viewed',
      action: 'viewed the invoice.',
      user: {
        name: 'Thomas Wright',
      },
      timestamp: '12h ago',
    },
    {
      id: '6',
      type: 'paid',
      action: 'paid the invoice.',
      user: {
        name: 'Thomas Wright',
      },
      timestamp: '4h ago',
    },
  ];

  currentUser = {
    name: 'Current User',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  };

  feelOptions: { value: string; label: string }[] = [
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'surprised', label: 'Surprised' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'angry', label: 'Angry' },
  ];

  feelIcons: Record<string, string> = {
    happy: 'sentiment_satisfied',
    sad: 'sentiment_dissatisfied',
    angry: 'sentiment_extremely_dissatisfied',
    surprised: 'sentiment_excited',
    neutral: 'sentiment_neutral',
  };

  selectedFeel = '';

  addComment(content: string): void {
    if (!content.trim()) return;

    const newComment: ActivityItem = {
      id: (this.activities.length + 1).toString(),
      type: 'commented',
      action: 'commented',
      user: this.currentUser,
      timestamp: 'Just now',
      comment: content.trim(),
    };

    this.activities.push(newComment);
  }
}
