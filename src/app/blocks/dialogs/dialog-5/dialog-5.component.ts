/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-5`
*/

import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { InviteMembersDialogComponent } from './invite-members-dialog.component';

@Component({
  selector: 'ngm-dev-block-dialog-5',
  templateUrl: './dialog-5.component.html',
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
})
export class Dialog5Component {
  private dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(InviteMembersDialogComponent, {
      maxWidth: '640px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Invite sent:', result);
      }
    });
  }
}
