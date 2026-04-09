/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/stacked-columns-table`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

export interface StackedColumnsTableUser {
  name: string;
  title: string;
  email: string;
  role: string;
}

const USERS: StackedColumnsTableUser[] = [
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
  selector: 'ngm-dev-block-stacked-columns-table',
  templateUrl: './stacked-columns-table.component.html',
  imports: [MatTableModule, MatButton],
})
export class StackedColumnsTableComponent {
  displayedColumns: string[] = ['name', 'title', 'email', 'role', 'actions'];
  dataSource = USERS;
}
