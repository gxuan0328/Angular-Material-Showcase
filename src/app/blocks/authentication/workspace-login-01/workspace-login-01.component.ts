/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update authentication/workspace-login-01`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-workspace-login-01',
  templateUrl: './workspace-login-01.component.html',
  styleUrls: ['./workspace-login-01.component.scss'],

  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class WorkspaceLogin01Component {
  form = new FormGroup({
    workspace: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
