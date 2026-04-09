/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/sticky-header-table`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

export interface StickyHeaderTableUser {
  name: string;
  title: string;
  email: string;
  role: string;
}

const USERS: StickyHeaderTableUser[] = [
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
  {
    name: 'Ethan Green',
    title: 'Developer',
    email: 'ethan.green@example.com',
    role: 'Admin',
  },
  {
    name: 'Fiona Black',
    title: 'Developer',
    email: 'fiona.black@example.com',
    role: 'User',
  },
  {
    name: 'George Brown',
    title: 'Developer',
    email: 'george.brown@example.com',
    role: 'User',
  },
  {
    name: 'Harry Potter',
    title: 'Developer',
    email: 'harry.potter@example.com',
    role: 'User',
  },

  {
    name: 'Hermione Granger',
    title: 'Developer',
    email: 'hermione.granger@example.com',
    role: 'User',
  },
  {
    name: 'Ron Weasley',
    title: 'Developer',
    email: 'ron.weasley@example.com',
    role: 'User',
  },
  {
    name: 'Draco Malfoy',
    title: 'Developer',
    email: 'draco.malfoy@example.com',
    role: 'User',
  },
  {
    name: 'Luna Lovegood',
    title: 'Developer',
    email: 'luna.lovegood@example.com',
    role: 'User',
  },
  {
    name: 'Neville Longbottom',
    title: 'Developer',
    email: 'neville.longbottom@example.com',
    role: 'User',
  },
  {
    name: 'Ginny Weasley',
    title: 'Developer',
    email: 'ginny.weasley@example.com',
    role: 'User',
  },
];

@Component({
  selector: 'ngm-dev-block-sticky-header-table',
  templateUrl: './sticky-header-table.component.html',
  imports: [MatTableModule, MatButton],
})
export class StickyHeaderTableComponent {
  displayedColumns: string[] = ['name', 'title', 'email', 'role'];
  dataSource = USERS;
}
