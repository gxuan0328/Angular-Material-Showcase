/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/filter-http-data-source-table`
*/

import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function emptyFilterValueValidator(
  predefinedFilters: string[],
  filterInput: FormControl<string | null>,
): ValidatorFn {
  return (control: AbstractControl<string[]>): ValidationErrors | null => {
    const filter = filterInput.value ?? '';

    // check if filter is from the predefined filters and it does not have any value, i.e. nothing after :
    const emptyFilter =
      predefinedFilters.includes(filter) && filter.split(':')[1] === '';
    return emptyFilter ? { emptyFilter: filter.split(':')[0] } : null;
  };
}
