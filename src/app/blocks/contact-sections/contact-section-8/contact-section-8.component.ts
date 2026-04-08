/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update contact-sections/contact-section-8`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'ngm-dev-block-contact-section-8',
  templateUrl: './contact-section-8.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatInput, MatLabel],
})
export class ContactSection8Component {}
