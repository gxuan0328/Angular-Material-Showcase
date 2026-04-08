/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-10`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  authorImage: string;
  date: string;
  category: string;
  imageUrl: string;
};

@Component({
  selector: 'ngm-dev-block-blog-section-10',
  templateUrl: './blog-section-10.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class BlogSection10Component {
  featuredPost: BlogPost = {
    id: 1,
    title: 'Building a Design System from Scratch',
    excerpt:
      'Learn how to create a comprehensive design system that scales with your organization. This guide covers everything from design tokens and component libraries to documentation and governance.',
    author: 'Sarah Johnson',
    authorImage: 'https://placehold.co/100x100/6366f1/ffffff?text=SJ',
    date: 'Dec 26, 2025',
    category: 'Design Systems',
    imageUrl: 'https://placehold.co/1200x800/6366f1/ffffff?text=Design+System',
  };

  posts: BlogPost[] = [
    {
      id: 2,
      title: 'Modern CSS Architecture',
      excerpt:
        'Explore modern approaches to structuring CSS in large applications.',
      author: 'Tyler Anderson',
      authorImage: 'https://placehold.co/100x100/8b5cf6/ffffff?text=TA',
      date: 'Dec 24, 2025',
      category: 'CSS',
      imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=CSS',
    },
    {
      id: 3,
      title: 'API Rate Limiting Strategies',
      excerpt:
        'Implement effective rate limiting to protect your APIs from abuse.',
      author: 'Diana Foster',
      authorImage: 'https://placehold.co/100x100/ec4899/ffffff?text=DF',
      date: 'Dec 22, 2025',
      category: 'Backend',
      imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=Rate+Limit',
    },
    {
      id: 4,
      title: 'Web Performance Optimization',
      excerpt:
        'Techniques to make your web applications faster and more efficient.',
      author: 'Brian Cooper',
      authorImage: 'https://placehold.co/100x100/f59e0b/ffffff?text=BC',
      date: 'Dec 20, 2025',
      category: 'Performance',
      imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Performance',
    },
  ];
}
