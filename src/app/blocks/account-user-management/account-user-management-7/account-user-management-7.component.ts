/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-7`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvvvatarsComponent } from '@ngxpert/avvvatars';

interface Member {
  id: number;
  email: string;
  initials: string;
}

@Component({
  selector: 'ngm-dev-block-account-user-management-7',
  templateUrl: './account-user-management-7.component.html',

  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AvvvatarsComponent,
  ],
})
export class AccountUserManagement7Component {
  members: Member[] = [
    {
      id: 1,
      email: 'max@company.com',
      initials: 'MA',
    },
    {
      id: 2,
      email: 'john@company.com',
      initials: 'JO',
    },
    {
      id: 3,
      email: 'emma@company.com',
      initials: 'EM',
    },
  ];

  workspaceForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    memberEmail: new FormControl(''),
  });

  addMember(): void {
    if (this.workspaceForm.get('memberEmail')?.value) {
      console.log('Add member:', this.workspaceForm.get('memberEmail')?.value);
      this.workspaceForm.get('memberEmail')?.reset();
    }
  }

  removeMember(memberId: number): void {
    this.members = this.members.filter((member) => member.id !== memberId);
  }

  onSubmit(): void {
    if (this.workspaceForm.valid) {
      console.log('Create workspace:', this.workspaceForm.value);
    }
  }
}
