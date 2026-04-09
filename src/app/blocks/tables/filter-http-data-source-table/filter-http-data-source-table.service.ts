/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-http-data-source-table`
*/

import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Octokit } from '@octokit/core';
import { OWNER, REPO } from './filter-http-data-source-table.constants';
import { GithubLabel } from './filter-http-data-source-table.types';
import {
  catchError,
  from,
  first,
  map,
  of,
  tap,
  forkJoin,
  concatMap,
} from 'rxjs';
import { parseLinkHeader } from '../../utils/functions/parse-link-header';

@Injectable()
export class FilterHttpDataSourceService {
  private readonly octokit = new Octokit();
  lastPage = 0;

  private readonly labelsObs = this.getAllLabels();

  readonly labels: Signal<GithubLabel[]>;

  constructor() {
    this.labels = toSignal(this.labelsObs, { initialValue: [] });
  }

  private getAllLabels() {
    // First, get the first page to determine total pages
    return from(
      this.octokit.request('GET /repos/{owner}/{repo}/labels', {
        owner: OWNER,
        repo: REPO,
        per_page: 100,
        page: 1,
      }),
    ).pipe(
      first(),
      tap((res) => {
        const linkHeader = res.headers.link ?? '';
        const parsedLinks = parseLinkHeader(linkHeader);
        this.lastPage = parsedLinks['last']
          ? Number(new URL(parsedLinks['last'].url).searchParams.get('page')) ||
            1
          : 1;
      }),
      concatMap((firstPageRes) => {
        const firstPageLabels = firstPageRes.data as GithubLabel[];

        // If there's only one page, return the first page data
        if (this.lastPage <= 1) {
          return of(firstPageLabels);
        }

        // Create requests for all remaining pages
        const remainingPageRequests = Array.from(
          { length: this.lastPage - 1 },
          (_, index) => {
            const pageNumber = index + 2; // Start from page 2
            return from(
              this.octokit.request('GET /repos/{owner}/{repo}/labels', {
                owner: OWNER,
                repo: REPO,
                per_page: 100,
                page: pageNumber,
              }),
            ).pipe(
              map((res) => res.data as GithubLabel[]),
              catchError((err) => {
                console.error(`Error fetching page ${pageNumber}:`, err);
                return of([]);
              }),
            );
          },
        );

        // Execute all remaining page requests in parallel
        return forkJoin(remainingPageRequests).pipe(
          map((remainingPagesData) => {
            // Combine first page with all other pages
            return [firstPageLabels, ...remainingPagesData].flat();
          }),
        );
      }),
      catchError((err) => {
        console.error('Error fetching labels:', err);
        return of([]);
      }),
    );
  }
}
