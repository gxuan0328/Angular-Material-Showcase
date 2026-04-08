/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/feed-with-comments-01`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgOptimizedImage } from '@angular/common';

interface Author {
  name: string;
  initials: string;
  isAuthor?: boolean;
  img: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  isReplying?: boolean;
  replies?: Comment[];
  parentId?: string;
}

@Component({
  selector: 'ngm-dev-block-feed-with-comments-01',
  templateUrl: './feed-with-comments-01.component.html',

  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgOptimizedImage,
  ],
})
export class FeedWithComments01Component {
  comments: Comment[] = [
    {
      id: '1',
      author: {
        name: 'Ryan Zhang',
        initials: 'RZ',
        img: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      content:
        'The new dark mode implementation looks fantastic! The contrast ratios are perfect, and the transitions between modes are super smooth.',
      timestamp: '4h ago',
      likes: 24,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Olivia Parker',
            initials: 'OP',
            img: 'https://randomuser.me/api/portraits/women/32.jpg',
            isAuthor: true,
          },
          content:
            'Thanks for the feedback! We spent a lot of time perfecting those transitions.',
          timestamp: '2h ago',
          likes: 8,
          parentId: '1',
        },
      ],
    },
    {
      id: '2',
      author: {
        name: 'Maya Patel',
        initials: 'MP',
        img: 'https://randomuser.me/api/portraits/women/28.jpg',
      },
      content:
        'Could we add an option to customize the animation duration? Some users might prefer faster transitions.',
      timestamp: '6h ago',
      likes: 15,
    },
  ];

  onLike(comment: Comment): void {
    comment.likes = (comment.likes || 0) + 1;
  }

  toggleReply(comment: Comment): void {
    comment.isReplying = !comment.isReplying;
  }

  addReply(parentComment: Comment, content: string): void {
    if (!content.trim()) return;

    const newReply: Comment = {
      id: `${parentComment.id}-${(parentComment.replies?.length || 0) + 1}`,
      author: {
        name: 'Current User',
        initials: 'CU',
        img: 'https://randomuser.me/api/portraits/men/90.jpg',
      },
      content: content.trim(),
      timestamp: 'Just now',
      likes: 0,
      parentId: parentComment.id,
    };

    if (!parentComment.replies) {
      parentComment.replies = [];
    }
    parentComment.replies.push(newReply);
    parentComment.isReplying = false;
  }
}
