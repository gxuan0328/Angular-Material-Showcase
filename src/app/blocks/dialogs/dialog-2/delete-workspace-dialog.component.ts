/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-2`
*/

import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'ngm-dev-block-delete-workspace-dialog',
  templateUrl: './delete-workspace-dialog.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
})
export class DeleteWorkspaceDialogComponent {
  deleteForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });
  hidePassword = signal(true);

  onSubmit() {
    if (this.deleteForm.valid) {
      console.log('Form submitted:', this.deleteForm.value);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword.update((hidePassword) => !hidePassword);
  }
}
