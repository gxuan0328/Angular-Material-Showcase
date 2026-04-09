/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-4`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { AvvvatarsComponent } from '@ngxpert/avvvatars';

interface Tab {
  id: string;
  label: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: 'Admin' | 'Guest' | 'Member';
}

@Component({
  selector: 'ngm-dev-block-account-user-management-4',
  templateUrl: './account-user-management-4.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatMenuModule,
    NgClass,
    AvvvatarsComponent,
  ],
})
export class AccountUserManagement4Component {
  tabs: Tab[] = [
    { id: 'account', label: 'Account details' },
    { id: 'users', label: 'Users' },
    { id: 'billing', label: 'Billing' },
  ];

  users: User[] = [
    {
      id: '1',
      name: 'Alissia Stone',
      email: 'a.stone@gmail.com',
      initials: 'AS',
      role: 'Admin',
    },
    {
      id: '2',
      name: 'Emma Bern',
      email: 'e.bern@gmail.com',
      initials: 'EB',
      role: 'Guest',
    },
    {
      id: '3',
      name: 'Aaron Wave',
      email: 'a.flow@acme.com',
      initials: 'AW',
      role: 'Guest',
    },
    {
      id: '4',
      name: 'Thomas Palstein',
      email: 't.palstein@acme.com',
      initials: 'TP',
      role: 'Member',
    },
    {
      id: '5',
      name: 'Sarah Johnson',
      email: 's.johnson@gmail.com',
      initials: 'SJ',
      role: 'Admin',
    },
    {
      id: '6',
      name: 'Megan Brown',
      email: 'm.brown@gmail.com',
      initials: 'MB',
      role: 'Guest',
    },
  ];

  editUser(userId: string): void {
    console.log('Edit user:', userId);
  }
}
