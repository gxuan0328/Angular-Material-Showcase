/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update form-layouts/form-layout-5`
*/

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

type Workspace = {
  id: number;
  title: string;
  description: string;
  users: string;
};

@Component({
  selector: 'ngm-dev-block-form-layout-5',
  templateUrl: './form-layout-5.component.html',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatListModule,
  ],
})
export class FormLayout5Component {
  private _fb = inject(FormBuilder);

  workspaces: Workspace[] = [
    {
      id: 1,
      title: 'Starter',
      description: 'Up to 10,000 requests per day.',
      users: 'Free',
    },
    {
      id: 2,
      title: 'Premium',
      description: '500,000 requests per day¹',
      users: '$900/month²',
    },
    {
      id: 3,
      title: 'Enterprise',
      description: 'Based on your specific needs',
      users: 'Custom',
    },
  ];

  features: Record<number, string[]> = {
    1: ['Community support', '50 GB storage', 'Integrated application builder'],
    2: [
      'Slack Connect support',
      '100 GB storage',
      'Managed workspace',
      'Integrated application builder',
    ],
    3: [
      'Priority Support with Slack Connect',
      'Unlimited storage',
      'Integrated application builder',
      'Volume discount',
    ],
  };

  selectedWorkspace = signal<Workspace>(this.workspaces[0]);

  form = this._fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    size: [''],
    workspace: [this.selectedWorkspace()],
  });

  setSelectedWorkspace(workspace: Workspace): void {
    this.selectedWorkspace.set(workspace);
    this.form.get('workspace')?.setValue(workspace);
  }

  getFeatures(workspaceId: number): string[] {
    return this.features[workspaceId] || [];
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    }
  }

  goBack(): void {
    console.log('Go back clicked');
  }
}
