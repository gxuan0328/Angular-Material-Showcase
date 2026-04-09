/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-12`
*/

import {
  Component,
  computed,
  signal,
  effect,
  ViewEncapsulation,
  inject,
  ANIMATION_MODULE_TYPE,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  ConnectedOverlayPositionChange,
  OverlayModule,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogModule,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
// get device.service using `npx @ngm-dev/cli add utils/services`
import { DeviceService } from '../../utils/services/device.service';
import { take } from 'rxjs/operators';
import { MatChipsModule } from '@angular/material/chips';
// Define category options
interface Category {
  value: string;
  label: string;
  icon: string;
}

// Define condition options
interface Condition {
  value: string;
  label: string;
}

// Add interface for form structure
interface Filter {
  category: string;
  condition: string;
  value: string;
}

interface FilterForm {
  category: FormControl<string>;
  condition: FormControl<string>;
  value: FormControl<string>;
}

interface FilterBar {
  startDate: Date;
  endDate: Date;
  filters: Filter[];
}

interface FilterBarForm {
  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
  filters: FormControl<Filter[]>;
}

/** Name of the enter animation `@keyframes`. */
const ENTER_ANIMATIONS = [
  'filter-transactions-fade-in-up',
  'filter-transactions-fade-in-down',
];

/** Name of the exit animation `@keyframes`. */
const EXIT_ANIMATIONS = [
  'filter-transactions-fade-out-up',
  'filter-transactions-fade-out-down',
];

@Component({
  selector: 'ngm-dev-block-filterbar-12',
  templateUrl: './filterbar-12.component.html',
  styleUrls: ['./filterbar-12.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    OverlayModule,
    MatCardModule,
    MatChipsModule,
    DatePipe,
  ],
  // Disable view encapsulation so that animations are not scoped to the component
  encapsulation: ViewEncapsulation.None,
})
export class Filterbar12Component {
  private readonly today = new Date();
  private readonly startDate = new Date(
    this.today.setDate(this.today.getDate() - 10),
  );

  formGroup = new FormGroup<FilterBarForm>({
    startDate: new FormControl(this.startDate, { nonNullable: true }),
    endDate: new FormControl(this.today, { nonNullable: true }),
    filters: new FormControl<Filter[]>([], { nonNullable: true }),
  });

  addFilterForm = new FormGroup<FilterForm>({
    category: new FormControl('address', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    condition: new FormControl('contains', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Category options
  categories: Category[] = [
    {
      value: 'address',
      label: 'Address',
      icon: 'place',
    },
    {
      value: 'product_id',
      label: 'Product_id',
      icon: 'sell',
    },
    {
      value: 'amount',
      label: 'Amount',
      icon: 'database',
    },
    {
      value: 'status',
      label: 'Status',
      icon: 'info',
    },
  ];

  // Condition options
  conditions: Condition[] = [
    {
      value: 'contains',
      label: 'Contains',
    },
    {
      value: 'not-contains',
      label: 'Not contains',
    },
    {
      value: 'equals',
      label: 'Equals',
    },
    {
      value: 'is-greater-or-equal-than',
      label: 'Is greater or equal than',
    },
    {
      value: 'is-smaller-than',
      label: 'Is smaller than',
    },
  ];

  isAnimating = signal(false);
  isSoftOpen = signal(false);
  // Overlay state
  isOpen = false;

  animationDirection = signal<'up' | 'down'>('down');

  animationClass = computed(() => {
    const direction = this.animationDirection();
    const isOpen = this.isSoftOpen();
    return isOpen
      ? direction === 'up'
        ? 'animate-filter-transactions-fade-in-up'
        : 'animate-filter-transactions-fade-in-down'
      : direction === 'up'
        ? 'animate-filter-transactions-fade-out-down'
        : 'animate-filter-transactions-fade-out-up';
  });

  readonly _animationsDisabled =
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';

  readonly STANDARD_DROPDOWN_BELOW_POSITIONS =
    STANDARD_DROPDOWN_BELOW_POSITIONS.map((item) => ({
      ...item,
      offsetY: item.overlayY === 'bottom' ? -8 : 8,
    }));

  private dialog = inject(MatDialog);
  private deviceService = inject(DeviceService);

  constructor() {
    effect(() => {
      const isSoftOpen = this.isSoftOpen();
      if (isSoftOpen) {
        this.isOpen = true;
      } else {
        if (this._animationsDisabled) {
          this.isOpen = false;
        }
      }
    });
  }

  applyFilter(): void {
    this.formGroup
      .get('filters')
      ?.patchValue([
        ...(this.formGroup.get('filters')?.value || []),
        this.addFilterForm.value as Filter,
      ]);
    this.closeOverlay();
    this.addFilterForm.reset();
  }

  removeFilter(filter: Filter): void {
    this.formGroup
      .get('filters')
      ?.setValue(
        (this.formGroup.get('filters')?.value || []).filter(
          (f) => f !== filter,
        ),
      );
  }

  clearFilter(): void {
    this.formGroup.get('filters')?.setValue([]);
    this.closeOverlay();
  }

  clearNewFilter(): void {
    this.addFilterForm.reset();
    this.closeOverlay();
  }

  getSelectedCategory(category?: string): Category {
    return (
      this.categories.find(
        (c) =>
          c.value === (category ?? this.addFilterForm.get('category')?.value),
      ) || this.categories[0]
    );
  }

  // Toggle overlay
  toggleOverlay(): void {
    this.deviceService.isHandset$.pipe(take(1)).subscribe((isHandset) => {
      if (isHandset) {
        this.openFilterDialog();
      } else {
        this.isSoftOpen.update((value) => !value);
      }
    });
  }

  openFilterDialog(): void {
    const options: MatDialogConfig = {
      maxWidth: '100dvw',
      panelClass: 'full-screen-dialog',
      minWidth: '100dvw',
      minHeight: '100dvh',
      data: {
        filterForm: this.formGroup.value,
        categories: this.categories,
        conditions: this.conditions,
      },
    };
    const dialogRef = this.dialog.open(
      Filterbar12FilterDialogComponent,
      options,
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formGroup
          .get('filters')
          ?.setValue([...(this.formGroup.get('filters')?.value || []), result]);
      }
    });
  }

  // Close overlay
  closeOverlay(): void {
    this.isSoftOpen.set(false);
  }

  onPositionChange(event: ConnectedOverlayPositionChange): void {
    this.animationDirection.set(
      event.connectionPair.overlayY === 'bottom' ? 'up' : 'down',
    );
  }

  /** Callback that is invoked when the panel animation completes. */
  onAnimationDone(state: string) {
    const isExit = EXIT_ANIMATIONS.includes(state);

    if (isExit) {
      this.isOpen = false;
    }

    this.isAnimating.set(false);
  }

  onAnimationStart(state: string) {
    this.isAnimating.set(
      ENTER_ANIMATIONS.includes(state) || EXIT_ANIMATIONS.includes(state),
    );
  }
}

@Component({
  selector: 'ngm-dev-block-filterbar-12-filter-dialog',
  templateUrl: './filterbar-12-filter-dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
  ],
})
export class Filterbar12FilterDialogComponent {
  isHandset$ = inject(DeviceService).isHandset$;
  // Update dialog form to be typed
  filterForm = new FormGroup<FilterForm>({
    category: new FormControl('address', { nonNullable: true }),
    condition: new FormControl('contains', { nonNullable: true }),
    value: new FormControl('', { nonNullable: true }),
  });
  private dialogRef = inject(MatDialogRef<Filterbar12FilterDialogComponent>);
  data = inject<{
    categories: Category[];
    conditions: Condition[];
  }>(MAT_DIALOG_DATA);

  onSubmit(): void {
    this.dialogRef.close(this.filterForm.value);
  }

  getSelectedCategory(): Category {
    return (
      this.data.categories.find(
        (c) => c.value === this.filterForm.get('category')?.value,
      ) || this.data.categories[0]
    );
  }

  clearFilter(): void {
    this.filterForm.get('category')?.setValue('address');
    this.filterForm.get('condition')?.setValue('contains');
    this.filterForm.get('value')?.setValue('');
  }
}
