/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-3`
*/

import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type DeactivateForm = {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
};

@Component({
  selector: 'ngm-dev-block-deactivate-auth-dialog',
  templateUrl: './deactivate-auth-dialog.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
})
export class DeactivateAuthDialogComponent {
  private dialogRef = inject(MatDialogRef<DeactivateAuthDialogComponent>);

  deactivateForm = new FormGroup<DeactivateForm>({
    email: new FormControl({ value: 'emma@company.com', disabled: true }),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.deactivateForm.valid) {
      console.log('Form submitted:', this.deactivateForm.value);
      this.dialogRef.close(this.deactivateForm.getRawValue());
    }
  }
}
