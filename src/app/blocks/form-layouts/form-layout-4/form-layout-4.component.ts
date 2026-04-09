/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update form-layouts/form-layout-4`
*/

import { Component, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
type Workspace = {
  id: number;
  title: string;
  description: string;
  price: string;
};

type CompanySize = {
  value: string;
  viewValue: string;
};

@Component({
  selector: 'ngm-dev-block-form-layout-4',
  templateUrl: './form-layout-4.component.html',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
  ],
})
export class FormLayout4Component {
  workspaces: Workspace[] = [
    {
      id: 1,
      title: 'Starter',
      description: 'Up to 10,000 requests per day.',
      price: 'Free',
    },
    {
      id: 2,
      title: 'Premium',
      description: '500,000 requests per day¹',
      price: '$900/month²',
    },
    {
      id: 3,
      title: 'Enterprise',
      description: 'Based on your specific needs',
      price: 'Custom',
    },
  ];

  companySizes: CompanySize[] = [
    { value: '1-9', viewValue: '1-9' },
    { value: '10-50', viewValue: '10-50' },
    { value: '50-250', viewValue: '50-250' },
    { value: '250+', viewValue: '250+' },
  ];

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl(''),
    companySize: new FormControl(''),
    workspace: new FormControl(this.workspaces[0].id),
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}
