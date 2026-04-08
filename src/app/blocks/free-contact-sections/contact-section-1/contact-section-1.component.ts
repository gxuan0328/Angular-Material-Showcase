/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-contact-sections/contact-section-1`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

type ContactMethod = {
  icon: string;
  title: string;
  description: string;
  link: string;
};

@Component({
  selector: 'ngm-dev-block-contact-section-1',
  templateUrl: './contact-section-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatFormField, MatInput, MatLabel],
})
export class ContactSection1Component {
  contactMethods: ContactMethod[] = [
    {
      icon: 'email',
      title: 'Email Support',
      description: 'Reach out to our support team',
      link: 'mailto:support@company.com',
    },
    {
      icon: 'phone',
      title: 'Phone',
      description: 'Mon-Fri from 8am to 6pm',
      link: 'tel:+1234567890',
    },
    {
      icon: 'location_on',
      title: 'Office',
      description: '123 Business Street, Suite 100',
      link: '#',
    },
  ];
}
