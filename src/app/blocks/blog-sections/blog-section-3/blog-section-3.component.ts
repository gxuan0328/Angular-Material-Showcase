/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-3`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
};

@Component({
  selector: 'ngm-dev-block-blog-section-3',
  templateUrl: './blog-section-3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class BlogSection3Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Implementing Microservices Architecture',
      excerpt:
        'A comprehensive guide to transitioning from monolithic applications to microservices. Learn about the benefits, challenges, and best practices for building distributed systems.',
      author: 'Robert Johnson',
      authorRole: 'Solutions Architect',
      date: 'Dec 19, 2025',
      readTime: '15 min read',
      category: 'Architecture',
      imageUrl: 'https://placehold.co/800x400/6366f1/ffffff?text=Microservices',
    },
    {
      id: 2,
      title: 'Advanced TypeScript Patterns',
      excerpt:
        'Master advanced TypeScript techniques and patterns that will make your code more maintainable and type-safe. Explore generics, decorators, and utility types.',
      author: 'Rachel Kim',
      authorRole: 'Tech Lead',
      date: 'Dec 17, 2025',
      readTime: '10 min read',
      category: 'Programming',
      imageUrl: 'https://placehold.co/800x400/8b5cf6/ffffff?text=TypeScript',
    },
    {
      id: 3,
      title: 'Cloud Infrastructure Optimization',
      excerpt:
        'Strategies for reducing cloud costs while maintaining performance and reliability. Learn about resource optimization, auto-scaling, and cost monitoring.',
      author: 'James Wilson',
      authorRole: 'DevOps Engineer',
      date: 'Dec 15, 2025',
      readTime: '12 min read',
      category: 'Cloud',
      imageUrl: 'https://placehold.co/800x400/ec4899/ffffff?text=Cloud+Ops',
    },
    {
      id: 4,
      title: 'Testing Strategies for Modern Apps',
      excerpt:
        'Build confidence in your code with comprehensive testing approaches. Explore unit testing, integration testing, and end-to-end testing best practices.',
      author: 'Linda Martinez',
      authorRole: 'QA Lead',
      date: 'Dec 13, 2025',
      readTime: '8 min read',
      category: 'Testing',
      imageUrl: 'https://placehold.co/800x400/f59e0b/ffffff?text=Testing',
    },
  ];
}
