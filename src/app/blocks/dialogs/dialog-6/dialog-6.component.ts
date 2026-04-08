/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-6`
*/

import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { AddApplicationDialogComponent } from './add-application-dialog.component';
// get device.service using `npx @ngm-dev/cli add utils/services`
import { DeviceService } from '../../utils/services/device.service';
import { take } from 'rxjs';
@Component({
  selector: 'ngm-dev-block-dialog-6',
  templateUrl: './dialog-6.component.html',
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
})
export class Dialog6Component {
  private dialog = inject(MatDialog);
  private deviceService = inject(DeviceService);

  openDialog(): void {
    this.deviceService.isHandset$.pipe(take(1)).subscribe((isHandset) => {
      const options: MatDialogConfig = {
        maxWidth: isHandset ? '100dvw' : '1024px',
        panelClass: 'full-screen-dialog',
      };
      if (isHandset) {
        options.minWidth = '100dvw';
        options.minHeight = '100dvh';
      }
      this.dialog.open(AddApplicationDialogComponent, options);
    });
  }
}
