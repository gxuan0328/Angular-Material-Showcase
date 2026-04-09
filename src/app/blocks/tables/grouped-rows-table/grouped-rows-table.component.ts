/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/grouped-rows-table`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

export interface GroupedRowsTableUser {
  name: string;
  title: string;
  email: string;
  role: string;
  city: string;
  isFirstCity?: boolean;
}

const USERS: GroupedRowsTableUser[] = [
  {
    name: 'John Doe',
    title: 'Software Engineer',
    email: 'john.doe@example.com',
    role: 'Admin',
    city: 'New York',
  },
  {
    name: 'Jane Smith',
    title: 'Product Manager',
    email: 'jane.smith@example.com',
    role: 'User',
    city: 'New York',
  },
  {
    name: 'Alice Johnson',
    title: 'Designer',
    email: 'alice.johnson@example.com',
    role: 'Admin',
    city: 'Chicago',
  },
  {
    name: 'Bob Brown',
    title: 'Developer',
    email: 'bob.brown@example.com',
    role: 'User',
    city: 'Chicago',
  },
  {
    name: 'Charlie Davis',
    title: 'Manager',
    email: 'charlie.davis@example.com',
    role: 'Admin',
    city: 'Miami',
  },
  {
    name: 'Diana White',
    title: 'Analyst',
    email: 'diana.white@example.com',
    role: 'User',
    city: 'Miami',
  },
];

@Component({
  selector: 'ngm-dev-block-grouped-rows-table',
  templateUrl: './grouped-rows-table.component.html',
  imports: [MatTableModule, MatButton],
})
export class GroupedRowsTableComponent {
  displayedColumns: string[] = ['name', 'title', 'email', 'role', 'actions'];
  // sort by city
  sortedData = USERS.sort((a, b) => a.city.localeCompare(b.city));
  dataSource = this.sortedData.map((user, index) => ({
    ...user,
    isFirstCity: index === this.firstCityIndex(user.city),
  }));

  isCityVisible(index: number, row: GroupedRowsTableUser) {
    return row.isFirstCity;
  }

  firstCityIndex(city: string) {
    return this.sortedData.findIndex((user) => user.city === city);
  }
}
