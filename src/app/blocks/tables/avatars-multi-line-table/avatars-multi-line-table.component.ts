/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/avatars-multi-line-table`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

export interface AvatarsMultiLineTableUser {
  name: string;
  title: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive';
}

const USERS: AvatarsMultiLineTableUser[] = [
  {
    name: 'John Doe',
    title: 'Software Engineer',
    email: 'john.doe@example.com',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
  },
  {
    name: 'Jane Smith',
    title: 'Product Manager',
    email: 'jane.smith@example.com',
    role: 'User',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'inactive',
  },
  {
    name: 'Alice Johnson',
    title: 'Designer',
    email: 'alice.johnson@example.com',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'active',
  },
  {
    name: 'Bob Brown',
    title: 'Developer',
    email: 'bob.brown@example.com',
    role: 'User',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'inactive',
  },
  {
    name: 'Charlie Davis',
    title: 'Manager',
    email: 'charlie.davis@example.com',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
  },
  {
    name: 'Diana White',
    title: 'Analyst',
    email: 'diana.white@example.com',
    role: 'User',
    avatar: 'https://i.pravatar.cc/150?img=6',
    status: 'inactive',
  },
];

@Component({
  selector: 'ngm-dev-block-avatars-multi-line-table',
  templateUrl: './avatars-multi-line-table.component.html',
  styleUrls: ['./avatars-multi-line-table.component.scss'],
  imports: [MatTableModule, MatButton, MatChip, MatChipSet],
})
export class AvatarsMultiLineTableComponent {
  displayedColumns: string[] = ['name', 'title', 'status', 'role', 'actions'];
  dataSource = USERS;
}
