/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-5`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
};

type Category = {
  name: string;
  count: number;
};

@Component({
  selector: 'ngm-dev-block-blog-section-5',
  templateUrl: './blog-section-5.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatLabel, MatInput],
})
export class BlogSection5Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Building Resilient Distributed Systems',
      excerpt:
        'Learn patterns and practices for building systems that can handle failures gracefully and recover automatically.',
      author: 'Daniel Foster',
      date: 'Dec 21, 2025',
      imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=Resilience',
    },
    {
      id: 2,
      title: 'Modern CSS Layout Techniques',
      excerpt:
        'Master CSS Grid, Flexbox, and Container Queries to create responsive layouts that adapt to any screen size.',
      author: 'Emma Davis',
      date: 'Dec 19, 2025',
      imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=CSS+Layout',
    },
    {
      id: 3,
      title: 'Introduction to Machine Learning',
      excerpt:
        'A beginner-friendly guide to understanding machine learning concepts and getting started with your first model.',
      author: 'Oliver Smith',
      date: 'Dec 17, 2025',
      imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=ML+Basics',
    },
    {
      id: 4,
      title: 'GraphQL vs REST: Choosing the Right API',
      excerpt:
        'Compare the strengths and weaknesses of GraphQL and REST to make an informed decision for your project.',
      author: 'Isabella Moore',
      date: 'Dec 15, 2025',
      imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=GraphQL+REST',
    },
  ];

  categories: Category[] = [
    { name: 'Development', count: 24 },
    { name: 'Design', count: 18 },
    { name: 'DevOps', count: 15 },
    { name: 'Security', count: 12 },
    { name: 'Cloud', count: 20 },
  ];
}
