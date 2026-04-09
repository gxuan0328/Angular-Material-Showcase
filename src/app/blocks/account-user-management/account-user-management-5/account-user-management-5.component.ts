/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-5`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

interface Role {
  name: string;
  value: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  href: string;
}

@Component({
  selector: 'ngm-dev-block-account-user-management-5',
  templateUrl: './account-user-management-5.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class AccountUserManagement5Component {
  displayedColumns: string[] = ['member', 'email', 'role', 'actions'];

  roles: Role[] = [
    { name: 'Guest', value: '1' },
    { name: 'Member', value: '2' },
    { name: 'Admin', value: '3' },
  ];

  existingUsers: User[] = [
    {
      name: 'Alissia Stone',
      email: 'a.stone@gmail.com',
      role: 'Admin',
      href: '#',
    },
    {
      name: 'Emma Bern',
      email: 'e.bern@gmail.com',
      role: 'Guest',
      href: '#',
    },
    {
      name: 'Aaron Wave',
      email: 'a.flow@acme.com',
      role: 'Guest',
      href: '#',
    },
    {
      name: 'Thomas Palstein',
      email: 't.palstein@acme.com',
      role: 'Member',
      href: '#',
    },
    {
      name: 'Sarah Johnson',
      email: 's.johnson@gmail.com',
      role: 'Admin',
      href: '#',
    },
    {
      name: 'Megan Brown',
      email: 'm.brown@gmail.com',
      role: 'Guest',
      href: '#',
    },
  ];

  pendingUsers: User[] = [
    {
      name: 'Mike Mueller',
      email: 'm.mueller@gmail.com',
      role: 'Admin',
      href: '#',
    },
  ];
}
