/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-http-data-source-table`
*/

import { Octokit } from '@octokit/core';
import { catchError, first, from, map, Observable, of } from 'rxjs';
import {
  GithubApi,
  GithubIssueOrder,
  GithubIssueSort,
  GithubSearchIssuesParams,
} from './filter-http-data-source-table.types';
import {
  EmptyGithubApi,
  OWNER,
  REPO,
} from './filter-http-data-source-table.constants';
import { CacheService } from '../../utils/services/cache.service';

export class FilterHttpDataSourceTableDatabase {
  constructor(private readonly cacheService: CacheService) {}
  private octokit = new Octokit();

  getRepoIssues(
    sort: GithubIssueSort,
    order: GithubIssueOrder,
    page: number,
    pageSize = 10,
    query?: string,
  ): Observable<GithubApi> {
    const params: GithubSearchIssuesParams = {
      query: {
        q: `repo:${OWNER}/${REPO} is:issue ` + (query ? ` ${query}` : ''),
        sort,
        page: page + 1,
        per_page: pageSize,
        advanced_search: 'true',
        order,
      },
    };
    const cacheId = JSON.stringify(params);
    const cachedData = this.cacheService.getCache<GithubApi>(cacheId);
    if (cachedData) {
      return of(cachedData);
    }
    const req = this.octokit.request('GET /search/issues', {
      ...params.query,
      owner: OWNER,
      repo: REPO,
    });
    return from(req).pipe(
      first(),
      map((res) => {
        const data = {
          ...res.data,
          rateLimitReached: res.headers['x-ratelimit-remaining'] === '0',
        };
        this.cacheService.setCache(cacheId, data);
        return data;
      }),
      catchError((err) => {
        console.error(err);
        if (err.status === 403) {
          return of({
            ...EmptyGithubApi,
            rateLimitReached: true,
          });
        }
        return of(EmptyGithubApi);
      }),
    );
  }
}
