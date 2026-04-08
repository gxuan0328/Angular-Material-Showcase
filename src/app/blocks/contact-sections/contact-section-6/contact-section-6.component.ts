/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update contact-sections/contact-section-6`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';

@Component({
  selector: 'ngm-dev-block-contact-section-6',
  templateUrl: './contact-section-6.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatInput, MatLabel, MatSelect, MatOption],
})
export class ContactSection6Component {
  topics = [
    'Product Demo',
    'Technical Support',
    'Sales Inquiry',
    'Partnership Opportunity',
    'General Question',
    'Other',
  ];
}
