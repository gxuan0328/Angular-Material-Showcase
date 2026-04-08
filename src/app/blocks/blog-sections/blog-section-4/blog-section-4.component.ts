/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-4`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatChipSet, MatChip } from '@angular/material/chips';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  imageUrl: string;
};

@Component({
  selector: 'ngm-dev-block-blog-section-4',
  templateUrl: './blog-section-4.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipSet, MatChip],
})
export class BlogSection4Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Getting Started with Container Orchestration',
      excerpt:
        'Learn the fundamentals of container orchestration and how it can simplify your deployment process.',
      author: 'Chris Anderson',
      date: 'Dec 20, 2025',
      readTime: '7 min read',
      tags: ['DevOps', 'Kubernetes', 'Docker'],
      imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=Containers',
    },
    {
      id: 2,
      title: 'Serverless Architecture Patterns',
      excerpt:
        'Explore common patterns and anti-patterns when building serverless applications.',
      author: 'Nicole Brown',
      date: 'Dec 18, 2025',
      readTime: '9 min read',
      tags: ['Serverless', 'AWS', 'Architecture'],
      imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Serverless',
    },
    {
      id: 3,
      title: 'Database Performance Tuning',
      excerpt:
        'Practical techniques for optimizing database queries and improving application performance.',
      author: 'Kevin Zhang',
      date: 'Dec 16, 2025',
      readTime: '11 min read',
      tags: ['Database', 'PostgreSQL', 'Performance'],
      imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=Database',
    },
    {
      id: 4,
      title: 'Mobile-First Design Principles',
      excerpt:
        'Creating responsive experiences that prioritize mobile users without compromising desktop functionality.',
      author: 'Sophie Taylor',
      date: 'Dec 14, 2025',
      readTime: '6 min read',
      tags: ['Design', 'Mobile', 'UX'],
      imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Mobile+First',
    },
    {
      id: 5,
      title: 'API Design Best Practices',
      excerpt:
        'Build robust and developer-friendly APIs that scale with your application.',
      author: 'Tom Harris',
      date: 'Dec 12, 2025',
      readTime: '10 min read',
      tags: ['API', 'REST', 'GraphQL'],
      imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=API+Design',
    },
    {
      id: 6,
      title: 'Monitoring and Observability',
      excerpt:
        'Implement comprehensive monitoring strategies to ensure system reliability and performance.',
      author: 'Anna White',
      date: 'Dec 10, 2025',
      readTime: '13 min read',
      tags: ['Monitoring', 'Observability', 'SRE'],
      imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Monitoring',
    },
  ];
}
