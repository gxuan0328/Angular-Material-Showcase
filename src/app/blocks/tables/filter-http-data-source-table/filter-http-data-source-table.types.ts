/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-http-data-source-table`
*/

import { components, operations } from '@octokit/openapi-types';

export interface FilterItem {
  value: string;
  label: string;
  icon?: string;
  items?: FilterItem[];
}

export type GithubIssue = components['schemas']['issue-search-result-item'];
export type GithubIssueSort =
  operations['search/issues-and-pull-requests']['parameters']['query']['sort'];
export type GithubIssueOrder =
  operations['search/issues-and-pull-requests']['parameters']['query']['order'];

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
  rateLimitReached?: boolean;
}

export type GithubSearchIssuesParams =
  operations['search/issues-and-pull-requests']['parameters'];

export type GithubLabel = components['schemas']['label'];
