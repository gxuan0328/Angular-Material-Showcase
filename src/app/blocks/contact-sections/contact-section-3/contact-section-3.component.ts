/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update contact-sections/contact-section-3`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

type Department = {
  name: string;
  email: string;
  description: string;
};

@Component({
  selector: 'ngm-dev-block-contact-section-3',
  templateUrl: './contact-section-3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatInput, MatLabel],
})
export class ContactSection3Component {
  departments: Department[] = [
    {
      name: 'Sales',
      email: 'sales@company.com',
      description: 'Questions about our products and pricing',
    },
    {
      name: 'Technical Support',
      email: 'support@company.com',
      description: 'Need help with technical issues',
    },
    {
      name: 'Partnerships',
      email: 'partners@company.com',
      description: 'Interested in collaborating with us',
    },
    {
      name: 'Media Inquiries',
      email: 'press@company.com',
      description: 'Press and media related questions',
    },
  ];
}
