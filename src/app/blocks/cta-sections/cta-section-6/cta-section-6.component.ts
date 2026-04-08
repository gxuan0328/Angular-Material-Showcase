/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update cta-sections/cta-section-6`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'ngm-dev-block-cta-section-6',
  templateUrl: './cta-section-6.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatInput, MatLabel],
})
export class CtaSection6Component {}
