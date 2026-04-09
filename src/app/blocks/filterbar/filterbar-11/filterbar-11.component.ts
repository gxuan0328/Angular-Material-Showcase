/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-11`
*/

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

// Define country options
interface Country {
  value: string;
  label: string;
}

// Define status options
interface Status {
  value: string;
  label: string;
}

// Define payment method options
interface PaymentMethod {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'ngm-dev-block-filterbar-11',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './filterbar-11.component.html',
})
export class Filterbar11Component {
  private fb = inject(FormBuilder);

  // Form group
  filterForm: FormGroup;

  // Country options
  countries: Country[] = [
    { value: 'all', label: 'All countries' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
  ];

  // Status options
  statuses: Status[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
    { value: 'refund-requested', label: 'Refund requested' },
  ];

  // Payment method options
  paymentMethods: PaymentMethod[] = [
    { value: 'all', label: 'All payment methods' },
    {
      value: 'credit_card',
      label: 'Credit card',
      icon: 'credit_card',
    },
    {
      value: 'paypal',
      label: 'PayPal',
      icon: 'account_balance_wallet',
    },
    {
      value: 'bank_transfer',
      label: 'Bank transfer',
      icon: 'account_balance',
    },
    {
      value: 'crypto',
      label: 'Cryptocurrency',
      disabled: true,
      icon: 'currency_bitcoin',
    },
  ];

  constructor() {
    // Set default date range to last 10 days
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 10);

    // Initialize form group
    this.filterForm = this.fb.group({
      startDate: [startDate],
      endDate: [today],
      country: ['all'],
      status: ['all'],
      paymentMethod: ['all'],
    });
  }

  // Helper method to get selected payment method object
  getSelectedPaymentMethod(): PaymentMethod {
    const selectedValue = this.filterForm.get('paymentMethod')?.value;
    return (
      this.paymentMethods.find((method) => method.value === selectedValue) ||
      this.paymentMethods[0]
    );
  }
}
