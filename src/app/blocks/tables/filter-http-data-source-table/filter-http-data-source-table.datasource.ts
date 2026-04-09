/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-http-data-source-table`
*/

import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { EventEmitter, signal } from '@angular/core';
import { FilterHttpDataSourceTableDatabase } from './filter-http-data-source-table.database';
import { merge, Observable, skipWhile, startWith, switchMap } from 'rxjs';
import { map } from 'rxjs';
import {
  GithubIssue,
  GithubIssueOrder,
  GithubIssueSort,
} from './filter-http-data-source-table.types';

export type FilterHttpDataSourceTableDataSourceItem = GithubIssue;

export class FilterHttpDataSourceTableDataSourceSort {
  private _active: GithubIssueSort = 'created';
  public get active(): GithubIssueSort {
    return this._active;
  }
  public set active(value: GithubIssueSort) {
    this._active = value;
    this.sortChange.emit();
  }
  private _direction: GithubIssueOrder = 'desc';
  public get direction(): GithubIssueOrder {
    return this._direction;
  }
  public set direction(value: GithubIssueOrder) {
    this._direction = value;
    this.sortChange.emit();
  }

  sortChange = new EventEmitter<void>();
}

export class FilterHttpDataSourceTableDataSource extends DataSource<FilterHttpDataSourceTableDataSourceItem> {
  data: FilterHttpDataSourceTableDataSourceItem[] = [];
  paginator: MatPaginator | undefined;
  sort: FilterHttpDataSourceTableDataSourceSort | undefined;
  filterList: FormControl<string[] | null> | undefined;
  resultsLength = signal(0);
  isLoadingResults = signal(true);
  isRateLimitReached = signal(false);
  isEmpty = signal(false);
  database: FilterHttpDataSourceTableDatabase | undefined;

  constructor() {
    super();
  }

  connect(): Observable<FilterHttpDataSourceTableDataSourceItem[]> {
    if (this.paginator && this.sort && this.database && this.filterList) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        this.paginator.page,
        this.sort.sortChange,
        this.filterList.valueChanges.pipe(
          skipWhile(() => !this.filterList?.valid),
        ),
      ).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.database!.getRepoIssues(
            this.sort!.active as GithubIssueSort,
            this.sort!.direction as GithubIssueOrder,
            this.paginator!.pageIndex,
            this.paginator!.pageSize,
            Array.isArray(this.filterList?.value)
              ? this.filterList.value.join(' ')
              : (this.filterList?.value ?? ''),
          ).pipe(
            map((data) => {
              this.isEmpty.set(data.items.length === 0);
              this.isLoadingResults.set(false);
              this.isRateLimitReached.set(data.rateLimitReached ?? false);
              this.resultsLength.set(data.total_count);
              return data.items;
            }),
          );
        }),
      );
    } else {
      throw Error(
        'Please set the paginator, sort and database on the data source before connecting.',
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect(): void {}
}
