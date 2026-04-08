/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update blog-sections/blog-section-8`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  selector: 'ngm-dev-block-blog-section-8',
  templateUrl: './blog-section-8.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class BlogSection8Component {
  posts: BlogPost[] = [
    {
      id: 1,
      title: 'Data Visualization Techniques',
      excerpt:
        'Master the art of presenting complex data in clear, compelling visual formats that drive insights and decision-making.',
      author: 'Jordan Taylor',
      authorRole: 'Data Scientist',
      date: 'Dec 24, 2025',
      readTime: '8 min read',
      category: 'Data Science',
      imageUrl: 'https://placehold.co/800x600/6366f1/ffffff?text=Data+Viz',
    },
    {
      id: 2,
      title: 'Kubernetes Deployment Strategies',
      excerpt:
        'Implement zero-downtime deployments with advanced Kubernetes strategies including blue-green, canary, and rolling updates.',
      author: 'Cameron White',
      authorRole: 'Platform Engineer',
      date: 'Dec 22, 2025',
      readTime: '12 min read',
      category: 'DevOps',
      imageUrl: 'https://placehold.co/800x600/8b5cf6/ffffff?text=K8s',
    },
    {
      id: 3,
      title: 'Responsive Web Design Patterns',
      excerpt:
        'Create fluid layouts that adapt seamlessly across devices using modern CSS techniques and responsive design principles.',
      author: 'Taylor Martinez',
      authorRole: 'UI/UX Designer',
      date: 'Dec 20, 2025',
      readTime: '10 min read',
      category: 'Design',
      imageUrl: 'https://placehold.co/800x600/ec4899/ffffff?text=Responsive',
    },
  ];
}
