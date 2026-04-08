/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-4`
*/

import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CreateWorkspaceDialogComponent } from './create-workspace-dialog.component';

type DialogResult =
  | {
      workspaceName: string;
      isPrivate: boolean;
    }
  | undefined;

@Component({
  selector: 'ngm-dev-block-dialog-4',
  templateUrl: './dialog-4.component.html',
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
})
export class Dialog4Component {
  private dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateWorkspaceDialogComponent, {
      maxWidth: '512px',
    });

    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (result) {
        console.log('Workspace created:', result);
      }
    });
  }
}
