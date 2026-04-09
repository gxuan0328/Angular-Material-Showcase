/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/simple-card-table`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardContent } from '@angular/material/card';

export interface SimpleCardTableUser {
  name: string;
  title: string;
  email: string;
  role: string;
}

const USERS: SimpleCardTableUser[] = [
  {
    name: 'John Doe',
    title: 'Software Engineer',
    email: 'john.doe@example.com',
    role: 'Admin',
  },
  {
    name: 'Jane Smith',
    title: 'Product Manager',
    email: 'jane.smith@example.com',
    role: 'User',
  },
  {
    name: 'Alice Johnson',
    title: 'Designer',
    email: 'alice.johnson@example.com',
    role: 'Admin',
  },
  {
    name: 'Bob Brown',
    title: 'Developer',
    email: 'bob.brown@example.com',
    role: 'User',
  },
  {
    name: 'Charlie Davis',
    title: 'Manager',
    email: 'charlie.davis@example.com',
    role: 'Admin',
  },
  {
    name: 'Diana White',
    title: 'Analyst',
    email: 'diana.white@example.com',
    role: 'User',
  },
];

@Component({
  selector: 'ngm-dev-block-simple-card-table',
  templateUrl: './simple-card-table.component.html',
  imports: [MatTableModule, MatButton, MatCard, MatCardContent],
})
export class SimpleCardTableComponent {
  displayedColumns: string[] = ['name', 'title', 'email', 'role', 'actions'];
  dataSource = USERS;
}
