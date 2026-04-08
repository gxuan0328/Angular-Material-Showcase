/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-4`
*/

import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ngm-dev-block-create-workspace-dialog',
  templateUrl: './create-workspace-dialog.component.html',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
})
export class CreateWorkspaceDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateWorkspaceDialogComponent>);
  private fb = inject(FormBuilder);

  workspaceForm: FormGroup = this.fb.group({
    workspaceName: ['', Validators.required],
    isPrivate: [false],
  });

  onSubmit(): void {
    if (this.workspaceForm.valid) {
      this.dialogRef.close(this.workspaceForm.value);
    }
  }
}
