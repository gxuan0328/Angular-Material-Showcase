/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update lists/feed-with-upvote-01`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { NgClass, NgOptimizedImage } from '@angular/common';

interface Author {
  name: string;
  img: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  timestamp: string;
  upvotes: number;
  comments: number;
  status: 'In Progress' | 'Completed' | 'Planned';
  tags: string[];
  isUpvoted?: boolean;
}

@Component({
  selector: 'ngm-dev-block-feed-with-upvote-01',
  templateUrl: './feed-with-upvote-01.component.html',
  styleUrls: ['./feed-with-upvote-01.component.scss'],

  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    NgOptimizedImage,
    NgClass,
  ],
})
export class FeedWithUpvote01Component {
  posts: Post[] = [
    {
      id: '1',
      title: 'Implementing responsive layouts with Angular Material Grid',
      content:
        'Looking for best practices on creating complex responsive layouts using Angular Material Grid system. Specifically interested in handling nested grids and breakpoint-specific behaviors.',
      author: {
        name: 'Lucas Martinez',
        img: 'https://randomuser.me/api/portraits/men/67.jpg',
      },
      timestamp: '2 days ago',
      upvotes: 35,
      comments: 18,
      status: 'In Progress',
      tags: ['Layout', 'Responsive'],
    },
    {
      id: '2',
      title: 'Custom form field appearances in Angular Material',
      content:
        'Working on creating a unique form field appearance for our design system. Need guidance on extending MatFormFieldAppearance and implementing custom styles while maintaining accessibility.',
      author: {
        name: 'Nina Thompson',
        img: 'https://randomuser.me/api/portraits/women/52.jpg',
      },
      timestamp: '8 hours ago',
      upvotes: 42,
      comments: 31,
      status: 'Completed',
      tags: ['Forms', 'Styling'],
    },
    {
      id: '3',
      title: 'Performance optimization techniques for Material components',
      content:
        'Exploring ways to optimize performance in a large-scale Angular Material application. Would love to discuss strategies for lazy loading, virtual scrolling, and reducing bundle size.',
      author: {
        name: 'Aiden Foster',
        img: 'https://randomuser.me/api/portraits/men/82.jpg',
      },
      timestamp: '12 hours ago',
      upvotes: 67,
      comments: 45,
      status: 'Planned',
      tags: ['Performance', 'Optimization'],
    },
  ];

  onUpvote(post: Post): void {
    if (post.isUpvoted) {
      post.upvotes--;
      post.isUpvoted = false;
    } else {
      post.upvotes++;
      post.isUpvoted = true;
    }
  }
}
