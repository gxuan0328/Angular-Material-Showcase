/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update contact-sections/contact-section-5`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

type SocialLink = {
  name: string;
  icon: string;
  url: string;
};

@Component({
  selector: 'ngm-dev-block-contact-section-5',
  templateUrl: './contact-section-5.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class ContactSection5Component {
  socialLinks: SocialLink[] = [
    { name: 'Twitter', icon: 'X', url: '#' },
    { name: 'LinkedIn', icon: 'in', url: '#' },
    { name: 'Facebook', icon: 'f', url: '#' },
    { name: 'Instagram', icon: 'camera_alt', url: '#' },
  ];
}
