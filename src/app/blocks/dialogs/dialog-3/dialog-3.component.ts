/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-3`
*/

import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DeactivateAuthDialogComponent } from './deactivate-auth-dialog.component';

type DialogResult =
  | {
      email: string;
      password: string;
    }
  | undefined;

@Component({
  selector: 'ngm-dev-block-dialog-3',
  templateUrl: './dialog-3.component.html',
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
})
export class Dialog3Component {
  private dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(DeactivateAuthDialogComponent, {
      maxWidth: '512px',
    });

    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (result) {
        console.log('Dialog confirmed:', result);
      }
    });
  }
}
