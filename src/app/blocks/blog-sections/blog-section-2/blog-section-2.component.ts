/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-2`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
};

@Component({
  selector: 'ngm-dev-block-blog-section-2',
  templateUrl: './blog-section-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class BlogSection2Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Building Next-Generation Applications',
      excerpt:
        'Dive deep into the architecture and design patterns that power modern, scalable applications. Learn how to leverage cutting-edge technologies to create robust solutions.',
      author: 'Alex Thompson',
      date: 'Dec 18, 2025',
      readTime: '12 min read',
      category: 'Engineering',
      imageUrl:
        'https://placehold.co/1200x600/6366f1/ffffff?text=Featured+Post',
      featured: true,
    },
    {
      id: 2,
      title: 'Design Systems at Scale',
      excerpt:
        'Creating consistent user experiences across large organizations.',
      author: 'Jessica Lee',
      date: 'Dec 16, 2025',
      readTime: '7 min read',
      category: 'Design',
      imageUrl:
        'https://placehold.co/600x400/8b5cf6/ffffff?text=Design+Systems',
    },
    {
      id: 3,
      title: 'Performance Optimization Techniques',
      excerpt: 'Strategies for building lightning-fast web applications.',
      author: 'David Park',
      date: 'Dec 14, 2025',
      readTime: '9 min read',
      category: 'Performance',
      imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=Performance',
    },
    {
      id: 4,
      title: 'Security Best Practices',
      excerpt:
        'Protecting your applications and users in an evolving threat landscape.',
      author: 'Maria Garcia',
      date: 'Dec 11, 2025',
      readTime: '11 min read',
      category: 'Security',
      imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Security',
    },
  ];

  featuredPost = this.posts.find((post) => post.featured);
  regularPosts = this.posts.filter((post) => !post.featured);
}
