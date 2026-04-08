/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-5`
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
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface Member {
  name: string;
  email: string;
  initials: string;
  status: string;
}

@Component({
  selector: 'ngm-dev-block-invite-members-dialog',
  templateUrl: './invite-members-dialog.component.html',

  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
  ],
})
export class InviteMembersDialogComponent {
  private dialogRef = inject(MatDialogRef<InviteMembersDialogComponent>);
  private fb = inject(FormBuilder);

  members: Member[] = [
    {
      name: 'Max Miller',
      email: 'max@company.com',
      initials: 'MM',
      status: 'member',
    },
    {
      name: 'Lena Wave',
      email: 'lena@company.com',
      initials: 'LW',
      status: 'member',
    },
    {
      name: 'Emma Ross',
      email: 'emma@company.com',
      initials: 'ER',
      status: 'member',
    },
  ];

  inviteForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.inviteForm.valid) {
      this.dialogRef.close(this.inviteForm.value);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
