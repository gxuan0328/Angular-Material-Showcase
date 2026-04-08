/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-6`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  views: string;
  comments: number;
};

@Component({
  selector: 'ngm-dev-block-blog-section-6',
  templateUrl: './blog-section-6.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class BlogSection6Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Real-Time Applications with WebSockets',
      excerpt:
        'Build interactive, real-time features using WebSockets and learn when to use them over traditional HTTP.',
      author: 'Marcus Wright',
      authorImage: 'https://placehold.co/100x100/6366f1/ffffff?text=MW',
      date: 'Dec 22, 2025',
      category: 'Web Development',
      imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=WebSockets',
      views: '2.4k',
      comments: 18,
    },
    {
      id: 2,
      title: 'State Management in Modern Applications',
      excerpt:
        'Explore different approaches to state management and choose the right solution for your needs.',
      author: 'Sophia Clark',
      authorImage: 'https://placehold.co/100x100/8b5cf6/ffffff?text=SC',
      date: 'Dec 20, 2025',
      category: 'Frontend',
      imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=State',
      views: '3.1k',
      comments: 25,
    },
    {
      id: 3,
      title: 'Continuous Integration Best Practices',
      excerpt:
        'Set up robust CI pipelines that catch bugs early and streamline your deployment process.',
      author: 'Ryan Cooper',
      authorImage: 'https://placehold.co/100x100/ec4899/ffffff?text=RC',
      date: 'Dec 18, 2025',
      category: 'CI/CD',
      imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=CI+CD',
      views: '1.8k',
      comments: 14,
    },
    {
      id: 4,
      title: 'Accessibility in Web Design',
      excerpt:
        'Create inclusive experiences that work for everyone by following web accessibility standards.',
      author: 'Maya Patel',
      authorImage: 'https://placehold.co/100x100/f59e0b/ffffff?text=MP',
      date: 'Dec 16, 2025',
      category: 'Accessibility',
      imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=A11y',
      views: '2.7k',
      comments: 32,
    },
    {
      id: 5,
      title: 'Caching Strategies for Better Performance',
      excerpt:
        'Implement effective caching at different layers of your application to improve speed and reduce costs.',
      author: 'Jake Turner',
      authorImage: 'https://placehold.co/100x100/10b981/ffffff?text=JT',
      date: 'Dec 14, 2025',
      category: 'Performance',
      imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Caching',
      views: '3.5k',
      comments: 21,
    },
    {
      id: 6,
      title: 'Building Progressive Web Apps',
      excerpt:
        'Transform your web application into a Progressive Web App for a native app-like experience.',
      author: 'Grace Lewis',
      authorImage: 'https://placehold.co/100x100/3b82f6/ffffff?text=GL',
      date: 'Dec 12, 2025',
      category: 'PWA',
      imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=PWA',
      views: '4.2k',
      comments: 29,
    },
  ];
}
