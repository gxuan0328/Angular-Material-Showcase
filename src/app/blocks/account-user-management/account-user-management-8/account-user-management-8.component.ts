/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update account-user-management/account-user-management-8`
*/

import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'ngm-dev-block-account-user-management-8',
  templateUrl: './account-user-management-8.component.html',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatCheckboxModule,
  ],
})
export class AccountUserManagement8Component implements OnInit {
  accountForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    selectAllNotifications: new FormControl(false),
    newsletter: new FormControl(false),
    memberActivities: new FormControl(false),
    deploymentActivities: new FormControl(false),
  });

  ngOnInit() {
    // Watch for changes in individual notification checkboxes
    const notificationControls = [
      'newsletter',
      'memberActivities',
      'deploymentActivities',
    ];
    notificationControls.forEach((control) => {
      this.accountForm.get(control)?.valueChanges.subscribe(() => {
        this.updateSelectAllState();
      });
    });
  }

  updateSelectAllState() {
    const notificationValues = [
      this.accountForm.get('newsletter')?.value,
      this.accountForm.get('memberActivities')?.value,
      this.accountForm.get('deploymentActivities')?.value,
    ];

    const allChecked = notificationValues.every((value) => value === true);
    const allUnchecked = notificationValues.every((value) => value === false);

    const selectAllControl = this.accountForm.get('selectAllNotifications');
    if (selectAllControl) {
      selectAllControl.setValue(allChecked, { emitEvent: false });
      selectAllControl.markAsTouched();
    }
  }

  isIndeterminate(): boolean {
    const notificationValues = [
      this.accountForm.get('newsletter')?.value,
      this.accountForm.get('memberActivities')?.value,
      this.accountForm.get('deploymentActivities')?.value,
    ];

    const allChecked = notificationValues.every((value) => value === true);
    const allUnchecked = notificationValues.every((value) => value === false);

    return !allChecked && !allUnchecked;
  }

  toggleAllNotifications(checked: boolean) {
    this.accountForm.patchValue({
      newsletter: checked,
      memberActivities: checked,
      deploymentActivities: checked,
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      console.log(this.accountForm.value);
    }
  }
}
