/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update form-layouts/form-layout-3`
*/

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'ngm-dev-block-form-layout-3',
  templateUrl: './form-layout-3.component.html',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class FormLayout3Component {
  private _fb = inject(FormBuilder);
  form = this._fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthYear: ['', Validators.required],
    role: [{ value: 'Senior Manager', disabled: true }],
    workspaceName: ['', Validators.required],
    visibility: ['private', Validators.required],
    workspaceDescription: [''],
    teamRequests: [true],
    teamActivityDigest: [false],
    apiRequests: [false],
    workspaceExecution: [false],
    queryCaching: [true],
    storage: [true],
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    }
  }

  onCancel(): void {
    this.form.reset();
  }
}
