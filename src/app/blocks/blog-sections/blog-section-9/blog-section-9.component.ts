/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-9`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
};

@Component({
  selector: 'ngm-dev-block-blog-section-9',
  templateUrl: './blog-section-9.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDivider],
})
export class BlogSection9Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Implementing OAuth 2.0 and OpenID Connect',
      excerpt:
        'A comprehensive guide to implementing modern authentication and authorization protocols in your applications with practical examples and security considerations.',
      author: 'Alex Thompson',
      date: 'Dec 25, 2025',
      readTime: '15 min read',
      category: 'Security',
    },
    {
      id: 2,
      title: 'Introduction to Serverless Computing',
      excerpt:
        'Discover how serverless architecture can reduce operational overhead and costs while improving scalability. Learn about Function-as-a-Service platforms and best practices.',
      author: 'Patricia Wilson',
      date: 'Dec 23, 2025',
      readTime: '11 min read',
      category: 'Cloud',
    },
    {
      id: 3,
      title: 'Advanced TypeScript Type System',
      excerpt:
        "Deep dive into TypeScript's type system including conditional types, mapped types, and template literal types to write more expressive and type-safe code.",
      author: 'Michael Chen',
      date: 'Dec 21, 2025',
      readTime: '14 min read',
      category: 'Programming',
    },
    {
      id: 4,
      title: 'Building Scalable REST APIs',
      excerpt:
        'Best practices for designing and implementing REST APIs that can handle millions of requests. Learn about versioning, pagination, caching, and rate limiting.',
      author: 'Jennifer Davis',
      date: 'Dec 19, 2025',
      readTime: '13 min read',
      category: 'Backend',
    },
    {
      id: 5,
      title: 'Container Security Best Practices',
      excerpt:
        'Secure your containerized applications with industry-standard practices including image scanning, runtime security, and secrets management.',
      author: 'Robert Garcia',
      date: 'Dec 17, 2025',
      readTime: '10 min read',
      category: 'Security',
    },
  ];
}
