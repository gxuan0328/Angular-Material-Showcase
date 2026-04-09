/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-9`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AvvvatarsComponent } from '@ngxpert/avvvatars';

interface Member {
  name: string;
  email: string;
  initials: string;
  status?: string;
}

@Component({
  selector: 'ngm-dev-block-account-user-management-9',
  templateUrl: './account-user-management-9.component.html',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    AvvvatarsComponent,
  ],
})
export class AccountUserManagement9Component {
  inviteForm = new FormGroup({
    role: new FormControl('1'),
    email: new FormControl(''),
  });

  roleOptions = [
    { name: 'Guest', value: '1' },
    { name: 'Member', value: '2' },
    { name: 'Admin', value: '3' },
  ];

  existingMembers: Member[] = [
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

  invitedMembers: Member[] = [
    {
      name: 'Tom Crown',
      email: 'tom@company.com',
      initials: 'TC',
    },
    {
      name: 'John Doe',
      email: 'john@company.com',
      initials: 'JD',
    },
    {
      name: 'Michael Crombie',
      email: 'michael@company.com',
      initials: 'MC',
    },
  ];

  onInvite() {
    if (this.inviteForm.valid) {
      console.log(this.inviteForm.value);
    }
  }

  onDeleteInvitation(member: Member) {
    this.invitedMembers = this.invitedMembers.filter(
      (m) => m.email !== member.email,
    );
  }
}
