import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

/**
 * Stepper 2 — Vertical Stepper
 * 4 linear steps: plan selection, payment, billing address, order confirmation.
 */
@Component({
  selector: 'app-stepper-2',
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
    <mat-stepper orientation="vertical" linear>
      <!-- Step 1: Plan selection -->
      <mat-step [stepControl]="planForm" label="選擇方案">
        <form [formGroup]="planForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>方案名稱</mat-label>
            <input matInput formControlName="plan" />
            @if (planForm.controls.plan.hasError('required') &&
                 planForm.controls.plan.touched) {
              <mat-error>請選擇方案</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 2: Payment info -->
      <mat-step [stepControl]="paymentForm" label="付款資訊">
        <form [formGroup]="paymentForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>卡號</mat-label>
            <input matInput formControlName="cardNumber" />
            @if (paymentForm.controls.cardNumber.hasError('required') &&
                 paymentForm.controls.cardNumber.touched) {
              <mat-error>請輸入卡號</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>持卡人姓名</mat-label>
            <input matInput formControlName="cardHolder" />
            @if (paymentForm.controls.cardHolder.hasError('required') &&
                 paymentForm.controls.cardHolder.touched) {
              <mat-error>請輸入持卡人姓名</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 3: Billing address -->
      <mat-step [stepControl]="addressForm" label="帳單地址">
        <form [formGroup]="addressForm" class="step-content">
          <mat-form-field appearance="outline">
            <mat-label>地址</mat-label>
            <input matInput formControlName="address" />
            @if (addressForm.controls.address.hasError('required') &&
                 addressForm.controls.address.touched) {
              <mat-error>請輸入帳單地址</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>城市</mat-label>
            <input matInput formControlName="city" />
            @if (addressForm.controls.city.hasError('required') &&
                 addressForm.controls.city.touched) {
              <mat-error>請輸入城市</mat-error>
            }
          </mat-form-field>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 4: Order confirmation -->
      <mat-step label="確認訂單">
        <div class="step-content summary">
          <h3>訂單摘要</h3>
          <dl>
            <dt>方案</dt>
            <dd>{{ planForm.controls.plan.value || '—' }}</dd>
            <dt>卡號</dt>
            <dd>{{ paymentForm.controls.cardNumber.value || '—' }}</dd>
            <dt>持卡人</dt>
            <dd>{{ paymentForm.controls.cardHolder.value || '—' }}</dd>
            <dt>帳單地址</dt>
            <dd>{{ addressForm.controls.address.value || '—' }}, {{ addressForm.controls.city.value || '—' }}</dd>
          </dl>

          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button type="button">確認下單</button>
          </div>
        </div>
      </mat-step>
    </mat-stepper>
  `,
})
export class Stepper2Component {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly planForm = this.fb.group({
    plan: ['', [Validators.required]],
  });

  protected readonly paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required]],
    cardHolder: ['', [Validators.required]],
  });

  protected readonly addressForm = this.fb.group({
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
  });
}
