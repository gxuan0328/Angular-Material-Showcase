/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-blog-sections/blog-section-1`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
};

@Component({
  selector: 'ngm-dev-block-blog-section-1',
  templateUrl: './blog-section-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class BlogSection1Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Mastering Modern Web Development',
      excerpt:
        'Discover the latest trends and best practices in web development that will help you build better applications.',
      author: 'Sarah Mitchell',
      date: 'Dec 15, 2025',
      readTime: '8 min read',
      category: 'Development',
      imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=Web+Dev',
    },
    {
      id: 2,
      title: 'The Future of AI in Business',
      excerpt:
        'Explore how artificial intelligence is transforming industries and creating new opportunities for innovation.',
      author: 'Michael Chen',
      date: 'Dec 12, 2025',
      readTime: '6 min read',
      category: 'Technology',
      imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=AI+Business',
    },
    {
      id: 3,
      title: 'Building Scalable Systems',
      excerpt:
        'Learn the key principles and patterns for designing systems that can grow with your business needs.',
      author: 'Emily Roberts',
      date: 'Dec 10, 2025',
      readTime: '10 min read',
      category: 'Architecture',
      imageUrl:
        'https://placehold.co/600x400/ec4899/ffffff?text=Scalable+Systems',
    },
  ];
}
