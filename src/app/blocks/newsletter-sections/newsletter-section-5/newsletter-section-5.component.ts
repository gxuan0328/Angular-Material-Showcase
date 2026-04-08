/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update newsletter-sections/newsletter-section-5`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'ngm-dev-block-newsletter-section-5',
  templateUrl: './newsletter-section-5.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatLabel, MatInput],
})
export class NewsletterSection5Component {}
