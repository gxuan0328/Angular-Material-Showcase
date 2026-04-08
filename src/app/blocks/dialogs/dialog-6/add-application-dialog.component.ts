/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update dialogs/dialog-6`
*/

import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
// get device.service using `npx @ngm-dev/cli add utils/services`
import { DeviceService } from '../../utils/services/device.service';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'ngm-dev-block-add-application-dialog',
  templateUrl: './add-application-dialog.component.html',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class AddApplicationDialogComponent {
  private dialogRef = inject(MatDialogRef<AddApplicationDialogComponent>);
  private fb = inject(FormBuilder);
  deviceService = inject(DeviceService);

  connectionForm: FormGroup = this.fb.group({
    connection: ['1', Validators.required],
    dataset: ['1', Validators.required],
    metrics: ['2', Validators.required],
    importMethod: ['1', Validators.required],
  });

  connections = [
    { value: '1', label: 'postgres_live' },
    { value: '2', label: 'postgres_test' },
    { value: '3', label: 'bigQuery_live' },
  ];

  datasets = [
    { value: '1', label: 'starterkit_sales' },
    { value: '2', label: 'starterkit_ecommerce' },
    { value: '3', label: 'starterkit_logs' },
  ];

  metrics = [
    { value: '1', label: 'all options' },
    { value: '2', label: 'log & health data' },
    { value: '3', label: 'product usage data' },
  ];

  importMethods = [
    { value: '1', label: 'direct query' },
    { value: '2', label: 'import' },
    { value: '3', label: 'direct query (incremental load)' },
  ];

  onSubmit(): void {
    if (this.connectionForm.valid) {
      this.dialogRef.close(this.connectionForm.value);
    }
  }
}
