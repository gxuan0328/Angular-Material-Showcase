/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-10`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AvvvatarsComponent } from '@ngxpert/avvvatars';

interface User {
  name: string;
  email: string;
  initials: string;
  currentRole: 'Admin' | 'Guest' | 'Member';
}

@Component({
  selector: 'ngm-dev-block-account-user-management-10',
  templateUrl: './account-user-management-10.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatDividerModule,
    ReactiveFormsModule,
    AvvvatarsComponent,
  ],
})
export class AccountUserManagement10Component {
  existingUsers: User[] = [
    {
      name: 'Lena Stone',
      email: 'lena.stone@company.com',
      initials: 'LS',
      currentRole: 'Admin',
    },
    {
      name: 'John Miller',
      email: 'john.miller@company.com',
      initials: 'JM',
      currentRole: 'Guest',
    },
    {
      name: 'Emma Crombie',
      email: 'emma.crombie@company.com',
      initials: 'EC',
      currentRole: 'Guest',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      initials: 'SJ',
      currentRole: 'Member',
    },
    {
      name: 'Alex Carter',
      email: 'alex.carter@company.com',
      initials: 'AC',
      currentRole: 'Member',
    },
  ];

  pendingUsers: User[] = [
    {
      name: 'Mike River',
      email: 'mike.river@company.com',
      initials: 'MR',
      currentRole: 'Guest',
    },
    {
      name: 'Aaron Hill',
      email: 'aaron.hill@company.com',
      initials: 'AH',
      currentRole: 'Guest',
    },
  ];

  roleControl = new FormControl();

  onRoleChange(user: User, newRole: string) {
    user.currentRole = newRole as 'Admin' | 'Guest' | 'Member';
  }

  deleteUser(users: User[], user: User) {
    const index = users.indexOf(user);
    if (index >= 0) {
      users.splice(index, 1);
    }
  }

  resendInvite(user: User) {
    console.log('Resending invite to:', user.email);
  }
}
