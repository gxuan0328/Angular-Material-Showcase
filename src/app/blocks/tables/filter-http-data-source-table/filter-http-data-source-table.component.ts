/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-http-data-source-table`
*/

import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  model,
  viewChild,
  signal,
  Signal,
} from '@angular/core';
import { FilterHttpDataSourceTableDatabase } from './filter-http-data-source-table.database';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatCell,
  MatCellDef,
  MatColumnDef,
} from '@angular/material/table';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  FilterHttpDataSourceTableDataSource,
  FilterHttpDataSourceTableDataSourceItem,
  FilterHttpDataSourceTableDataSourceSort,
} from './filter-http-data-source-table.datasource';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import {
  MatChip,
  MatChipInput,
  MatChipInputEvent,
  MatChipRemove,
  MatChipSet,
} from '@angular/material/chips';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatChipGrid, MatChipRow } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterHttpDataSourceService } from './filter-http-data-source-table.service';
import { FilterItem } from './filter-http-data-source-table.types';
import { emptyFilterValueValidator } from './filter-http-data-source-table.validations';
import { CacheService } from '../../utils/services/cache.service';

const ISSUE_DRAFT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17.32 3.205a.75.75 0 0 1 1.046-.177 11.056 11.056 0 0 1 2.605 2.606.75.75 0 1 1-1.222.869 9.554 9.554 0 0 0-2.252-2.252.75.75 0 0 1-.177-1.046Zm3.475 14.115a.75.75 0 0 1 .176 1.046 11.07 11.07 0 0 1-2.605 2.605.75.75 0 1 1-.869-1.222 9.554 9.554 0 0 0 2.252-2.252.75.75 0 0 1 1.046-.177ZM2.018 9.543a.75.75 0 0 1 .615.864 9.571 9.571 0 0 0 0 3.186.75.75 0 1 1-1.48.25 11.07 11.07 0 0 1 0-3.686.75.75 0 0 1 .865-.614Zm7.525 12.439a.75.75 0 0 1 .864-.615 9.571 9.571 0 0 0 3.186 0 .75.75 0 1 1 .25 1.48 11.07 11.07 0 0 1-3.686 0 .75.75 0 0 1-.614-.865ZM6.68 3.205a.75.75 0 0 1-.177 1.046A9.558 9.558 0 0 0 4.25 6.503a.75.75 0 1 1-1.223-.87 11.056 11.056 0 0 1 2.606-2.605.75.75 0 0 1 1.046.177ZM3.205 17.32a.75.75 0 0 1 1.046.177 9.554 9.554 0 0 0 2.252 2.252.75.75 0 1 1-.87 1.223 11.056 11.056 0 0 1-2.605-2.606.75.75 0 0 1 .177-1.046Zm6.952-16.166a11.07 11.07 0 0 1 3.686 0 .75.75 0 0 1-.25 1.479 9.571 9.571 0 0 0-3.186 0 .75.75 0 1 1-.25-1.48Zm11.825 8.389a.75.75 0 0 1 .864.614 11.07 11.07 0 0 1 0 3.686.75.75 0 0 1-1.479-.25 9.571 9.571 0 0 0 0-3.186.75.75 0 0 1 .615-.864Z"></path></svg>`;
const ISSUE_CLOSED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>`;
const ISSUE_OPENED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>`;
const ISSUE_MERGED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15 13.25a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm-12.5 6a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm0-14.5a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM5.75 6.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 6.5Zm0 14.5a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 5.75 21Zm12.5-6a1.75 1.75 0 1 0-.001-3.501A1.75 1.75 0 0 0 18.25 15Z"></path><path d="M6.5 7.25c0 2.9 2.35 5.25 5.25 5.25h4.5V14h-4.5A6.75 6.75 0 0 1 5 7.25Z"></path><path d="M5.75 16.75A.75.75 0 0 1 5 16V8a.75.75 0 0 1 1.5 0v8a.75.75 0 0 1-.75.75Z"></path></svg>`;
const GH_PERSON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path></svg>`;
const GH_TAG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7.75 6.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"></path><path d="M2.5 1h8.44a1.5 1.5 0 0 1 1.06.44l10.25 10.25a1.5 1.5 0 0 1 0 2.12l-8.44 8.44a1.5 1.5 0 0 1-2.12 0L1.44 12A1.497 1.497 0 0 1 1 10.94V2.5A1.5 1.5 0 0 1 2.5 1Zm0 1.5v8.44l10.25 10.25 8.44-8.44L10.94 2.5Z"></path></svg>`;

@Component({
  selector: 'ngm-dev-block-filter-http-data-source-table',
  templateUrl: './filter-http-data-source-table.component.html',
  styleUrls: ['./filter-http-data-source-table.component.scss'],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatChipSet,
    MatChip,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatTooltip,
    DatePipe,
    MatIcon,
    MatProgressBar,
    MatFormField,
    MatChipGrid,
    MatChipRow,
    MatAutocompleteModule,
    FormsModule,
    MatChipInput,
    MatChipRemove,
    ReactiveFormsModule,
    MatButton,
    MatLabel,
    MatNoDataRow,
    MatTable,
    MatRow,
    MatRowDef,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHint,
    MatError,
  ],
  providers: [FilterHttpDataSourceService],
})
export class FilterHttpDataSourceTableComponent {
  private readonly _injector = inject(Injector);
  private readonly cacheService = inject(CacheService);
  private database = new FilterHttpDataSourceTableDatabase(this.cacheService);

  readonly paginator = viewChild.required(MatPaginator);
  sort = new FilterHttpDataSourceTableDataSourceSort();
  readonly table = viewChild.required(MatTable);
  dataSource: FilterHttpDataSourceTableDataSource;
  isLoadingResults: Signal<boolean> | undefined;

  formGroup = new FormGroup({
    filterList: new FormControl<string[]>([]),
    filterInput: new FormControl<string>(''),
  });
  filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');

  displayedColumns: (keyof FilterHttpDataSourceTableDataSourceItem)[] = [
    'title',
  ];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly filters = model<string[]>([]);
  readonly announcer = inject(LiveAnnouncer);
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly filterSortPaginationService = inject(
    FilterHttpDataSourceService,
  );
  readonly labels = this.filterSortPaginationService.labels;
  private readonly matAutoCompleteTrigger = viewChild<MatAutocompleteTrigger>(
    MatAutocompleteTrigger,
  );
  isEmpty: Signal<boolean> | undefined;

  readonly allFilters = computed<FilterItem[]>(() => [
    {
      value: 'state:',
      label: 'State',
      icon: 'issue_draft',
      items: [
        {
          value: 'state:open',
          label: 'Open',
          icon: 'issue_open',
        },
        {
          value: 'state:closed',
          label: 'Closed',
          icon: 'issue_closed',
        },
        {
          value: 'state:merged',
          label: 'Merged',
          icon: 'issue_merged',
        },
        {
          value: 'state:draft',
          label: 'Draft',
          icon: 'issue_draft',
        },
      ],
    },
    {
      value: 'author:',
      label: 'Author',
      icon: 'gh_person',
    },
    {
      value: 'label:',
      label: 'Label',
      icon: 'gh_label',
      items: this.labels()?.map((label) => ({
        value: `label:${label.name}`,
        label: label.name,
        icon: 'gh_label',
      })),
    },
  ]);
  get filtersLevel1() {
    const filterInputValue = this.filterInput()?.nativeElement.value;
    if (filterInputValue) {
      const filteredFilters = this.allFilters().filter(
        (filter) =>
          filter.label.toLowerCase().includes(filterInputValue.toLowerCase()) ||
          filter.value.toLowerCase().includes(filterInputValue.toLowerCase()),
      );
      return filteredFilters;
    }
    return this.allFilters();
  }

  get filtersLevel2() {
    const filterInputValue = this.filterInput()?.nativeElement.value;
    if (filterInputValue) {
      const filteredFilters = this.allFilters().filter(
        (filter) =>
          filter.label.toLowerCase().includes(filterInputValue.toLowerCase()) ||
          filter.value.toLowerCase().includes(filterInputValue.toLowerCase()),
      );
      if (filterInputValue.includes(':')) {
        return filteredFilters[0]?.items ?? [];
      }
      return [];
    }
    return [];
  }

  get showLevel2() {
    const filterInputValue = this.filterInput()?.nativeElement.value;
    if (filterInputValue) {
      return filterInputValue.endsWith(':');
    }
    return false;
  }

  get filtersToShow() {
    return this.showLevel2 ? this.filtersLevel2 : this.filtersLevel1;
  }

  isRateLimitReached: Signal<boolean> | undefined;

  constructor() {
    this.matIconRegistry.addSvgIconLiteral(
      'issue_draft',
      this.sanitizer.bypassSecurityTrustHtml(ISSUE_DRAFT_ICON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'issue_closed',
      this.sanitizer.bypassSecurityTrustHtml(ISSUE_CLOSED_ICON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'issue_open',
      this.sanitizer.bypassSecurityTrustHtml(ISSUE_OPENED_ICON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'issue_merged',
      this.sanitizer.bypassSecurityTrustHtml(ISSUE_MERGED_ICON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'gh_person',
      this.sanitizer.bypassSecurityTrustHtml(GH_PERSON),
    );
    this.matIconRegistry.addSvgIconLiteral(
      'gh_label',
      this.sanitizer.bypassSecurityTrustHtml(GH_TAG),
    );
    this.dataSource = new FilterHttpDataSourceTableDataSource();

    afterNextRender(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator();
      this.dataSource.filterList = this.formGroup.controls.filterList;
      this.dataSource.database = this.database;

      this.table().dataSource = this.dataSource;
      this.isLoadingResults = this.dataSource.isLoadingResults.asReadonly();
      this.isEmpty = this.dataSource.isEmpty.asReadonly();
      this.isRateLimitReached = this.dataSource.isRateLimitReached.asReadonly();
      this.formGroup.controls.filterList.addValidators(
        emptyFilterValueValidator(
          this.allFilters().map((f) => f.value),
          this.formGroup.controls.filterInput,
        ),
      );
      this.formGroup.controls.filterList.updateValueAndValidity();
    });
  }

  getTooltip(labels: any[]): string {
    return labels
      .slice(3)
      .map((l) => l.name)
      .join(', ');
  }

  private changeFilterList(filters: string[]) {
    const isFirstPage = this.paginator()?.pageIndex === 0;
    this.formGroup.controls.filterList.setValue(filters, {
      emitEvent: isFirstPage,
    });
    if (!isFirstPage) {
      this.paginator()?.firstPage();
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Do not add partial filters, i.e. "state:"
    if (this.allFilters().find((f) => f.value === value)) {
      return;
    }
    // Add our filter
    if (value) {
      this.filters.update((filters) => [...filters, value]);
    }

    // Clear the input value
    event.chipInput!.clear();

    // Form control does not update until it's burred, hence we are manually updating it when updating filter.
    this.changeFilterList(this.filters());
  }
  remove(filterValue: string): void {
    this.filters.update((filters) => {
      const index = filters.indexOf(filterValue);
      if (index < 0) {
        return filters;
      }

      filters.splice(index, 1);
      this.announcer.announce(`Removed ${filterValue}`);
      return [...filters];
    });
    // Form control does not update until it's burred, hence we are manually updating it when updating filter.
    this.changeFilterList(this.filters());
  }

  clearAllFilters() {
    this.filters.set([]);
    this.changeFilterList([]);
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    const optionValue = event.option.value;
    if (
      optionValue.split(':').length === 2 &&
      optionValue.split(':')[1] !== ''
    ) {
      this.filters.update((filters) => [...filters, optionValue]);

      // Form control does not update until it's burred, hence we are manually updating it when updating filter.
      this.changeFilterList(this.filters());
      if (this.filterInput()) {
        this.filterInput()!.nativeElement.value = '';
      }
    } else {
      if (this.filterInput()) {
        this.filterInput()!.nativeElement.value = optionValue;
      }

      // Open the autocomplete panel if there are any 2nd level options to select.
      if (this.filtersLevel2.length > 0) {
        this.executeOnStable(() => this.matAutoCompleteTrigger()?.openPanel());
      }
    }
    event.option.deselect();
  }

  private executeOnStable(fn: () => void) {
    afterNextRender(
      () => {
        fn();
      },
      { injector: this._injector },
    );
  }
}
