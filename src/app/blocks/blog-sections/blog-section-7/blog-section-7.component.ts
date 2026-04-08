/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-7`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
};

@Component({
  selector: 'ngm-dev-block-blog-section-7',
  templateUrl: './blog-section-7.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class BlogSection7Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Understanding Reactive Programming',
      excerpt:
        'Explore the fundamentals of reactive programming and how it can transform the way you handle asynchronous data streams in modern applications.',
      author: 'Brandon Scott',
      date: 'Dec 23, 2025',
      category: 'Programming',
    },
    {
      id: 2,
      title: 'Authentication Best Practices',
      excerpt:
        'Learn how to implement secure authentication mechanisms in your applications with industry-standard protocols and techniques.',
      author: 'Victoria Chen',
      date: 'Dec 21, 2025',
      category: 'Security',
    },
    {
      id: 3,
      title: 'Microservices Communication Patterns',
      excerpt:
        'Discover effective communication strategies between microservices including synchronous, asynchronous, and event-driven approaches.',
      author: 'Nathan Brooks',
      date: 'Dec 19, 2025',
      category: 'Architecture',
    },
    {
      id: 4,
      title: 'Frontend Performance Metrics',
      excerpt:
        'Understand the key performance metrics that matter for frontend applications and how to measure and improve them effectively.',
      author: 'Samantha Reed',
      date: 'Dec 17, 2025',
      category: 'Performance',
    },
    {
      id: 5,
      title: 'Building Accessible Forms',
      excerpt:
        'Create forms that everyone can use by following accessibility guidelines and implementing proper ARIA attributes and keyboard navigation.',
      author: 'Marcus Johnson',
      date: 'Dec 15, 2025',
      category: 'Accessibility',
    },
    {
      id: 6,
      title: 'Event-Driven Architecture',
      excerpt:
        'Design scalable systems using event-driven architecture patterns that enable loose coupling and improved system resilience.',
      author: 'Ashley Morgan',
      date: 'Dec 13, 2025',
      category: 'Architecture',
    },
  ];
}
