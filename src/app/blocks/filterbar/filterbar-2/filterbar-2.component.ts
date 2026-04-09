/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-2`
*/

import { Component } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';

type UserOption = {
  value: string;
  label: string;
  initials: string;
  color: string;
};

@Component({
  selector: 'ngm-dev-block-filterbar-2',
  templateUrl: './filterbar-2.component.html',
  imports: [MatSelectModule],
})
export class Filterbar2Component {
  userOptions: UserOption[] = [
    {
      value: 'emma-callister',
      label: 'Emma Callister',
      initials: 'E',
      color: 'bg-blue-500',
    },
    {
      value: 'john-mayer',
      label: 'John Mayer',
      initials: 'J',
      color: 'bg-cyan-500',
    },
    {
      value: 'lena-stone',
      label: 'Lena Stone',
      initials: 'L',
      color: 'bg-purple-500',
    },
  ];

  selectedUser = 'emma-callister';

  getSelectedUserOption(): UserOption | undefined {
    return this.userOptions.find(
      (option) => option.value === this.selectedUser,
    );
  }
}
