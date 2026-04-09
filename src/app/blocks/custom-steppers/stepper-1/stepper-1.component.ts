import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

/**
 * Stepper 1 — Horizontal Basic
 * 3 linear steps: personal info, contact, confirmation.
 */
@Component({
  selector: 'app-stepper-1',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
    }
    .step-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .step-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .summary dt {
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
    }
    .summary dd {
      margin: 0 0 0.75rem;
    }
  `,
  template: `
    <mat-stepper linear>
      <!-- Step 1: Personal info -->
      <mat-step [stepControl]="personalForm" label="個人資料">
        <form [formGroup]="personalForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>姓名</mat-label>
            <input matInput formControlName="name" autocomplete="name" />
            @if (personalForm.controls.name.hasError('required') &&
                 personalForm.controls.name.touched) {
              <mat-error>請輸入姓名</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 2: Contact info -->
      <mat-step [stepControl]="contactForm" label="聯絡方式">
        <form [formGroup]="contactForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>電話號碼</mat-label>
            <input matInput formControlName="phone" autocomplete="tel" />
            @if (contactForm.controls.phone.hasError('required') &&
                 contactForm.controls.phone.touched) {
              <mat-error>請輸入電話號碼</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 3: Confirmation -->
      <mat-step label="確認">
        <div class="step-content summary">
          <h3>請確認您的資料</h3>
          <dl>
            <dt>姓名</dt>
            <dd>{{ personalForm.controls.name.value || '—' }}</dd>
            <dt>電話號碼</dt>
            <dd>{{ contactForm.controls.phone.value || '—' }}</dd>
          </dl>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button type="button">送出</button>
          </div>
        </div>
      </mat-step>
    </mat-stepper>
  `,
})
export class Stepper1Component {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly personalForm = this.fb.group({
    name: ['', [Validators.required]],
  });

  protected readonly contactForm = this.fb.group({
    phone: ['', [Validators.required]],
  });
}
