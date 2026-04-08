/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update contact-sections/contact-section-9`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

type OfficeLocation = {
  city: string;
  address: string;
  phone: string;
  email: string;
};

@Component({
  selector: 'ngm-dev-block-contact-section-9',
  templateUrl: './contact-section-9.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatInput, MatLabel],
})
export class ContactSection9Component {
  offices: OfficeLocation[] = [
    {
      city: 'San Francisco',
      address: '100 Smith Street, CA 94102',
      phone: '+1 (555) 123-4567',
      email: 'sf@company.com',
    },
    {
      city: 'New York',
      address: '200 Park Avenue, NY 10022',
      phone: '+1 (555) 987-6543',
      email: 'ny@company.com',
    },
    {
      city: 'London',
      address: '300 Oxford Street, W1C 1DX',
      phone: '+44 20 7123 4567',
      email: 'london@company.com',
    },
  ];
}
