/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/bar-list`
*/

import { Component, computed, input, output } from '@angular/core';
import { cx } from '../../utils/functions/cx';
import { focusRing } from '../../utils/functions/focus-ring';

type SortOrder = 'ascending' | 'descending' | 'none';

export type BarListItem<T = unknown> = T & {
  key?: string;
  href?: string;
  value: number;
  name: string;
};

@Component({
  selector: 'ngm-dev-block-ui-bar-list',

  templateUrl: './bar-list.component.html',
})
export class BarListComponent<T = unknown> {
  data = input.required<BarListItem<T>[]>();
  valueFormatter = input<(value: number) => string>((v: number) => `${v}`);
  sortFunction = input<
    (a: BarListItem<T>, b: BarListItem<T>, sortOrder: SortOrder) => number
  >((a, b, sortOrder) =>
    sortOrder === 'ascending' ? a.value - b.value : b.value - a.value,
  );
  showAnimation = input<boolean>(false);
  sortOrder = input<SortOrder>('descending');

  valueChange = output<BarListItem<T>>();

  private readonly rowHeightClass = 'h-8';

  // expose cx to template for composing classes with dynamic pieces
  public readonly cx = cx;

  readonly sortedData = computed(() => {
    const items = this.data() ?? [];
    const sort = this.sortOrder();
    if (sort === 'none') return items;
    const copy = [...items];
    copy.sort((a, b) => this.sortFunction()(a, b, sort));
    return copy;
  });

  readonly widths = computed(() => {
    const s = this.sortedData();
    const maxValue = Math.max(...s.map((i) => i.value), 0);
    return s.map((i) =>
      i.value === 0 ? 0 : Math.max((i.value / maxValue) * 100, 2),
    );
  });

  // class strings (constants)
  readonly containerClass: string = cx('flex justify-between space-x-6 px-1');

  readonly rowBaseClass = computed(() =>
    cx(
      'flex items-center rounded-sm transition-all',
      this.rowHeightClass,
      'bg-[color-mix(in_srgb,_var(--mat-sys-primary-container)_80%,_transparent)] hover:bg-primary-container',
      this.showAnimation() ? 'duration-800' : '',
    ),
  );

  readonly buttonWrapperClass: string = cx(
    'group w-full rounded-sm',
    ...focusRing,
    '-m-0! cursor-pointer',
    'hover:bg-gray-50 dark:hover:bg-gray-900',
  );

  readonly nameLinkClass: string = cx(
    'truncate whitespace-nowrap rounded-sm text-sm',
    'text-on-primary-container',
    'hover:underline hover:underline-offset-2',
    ...focusRing,
  );

  readonly nameTextClass: string = cx(
    'truncate whitespace-nowrap text-sm',
    'text-on-primary-container',
  );

  readonly valueTextClass: string = cx(
    'truncate whitespace-nowrap text-sm leading-none',
  );
}
