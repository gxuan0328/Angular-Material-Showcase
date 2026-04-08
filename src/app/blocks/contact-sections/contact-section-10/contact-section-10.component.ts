/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update contact-sections/contact-section-10`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

type TeamMember = {
  name: string;
  role: string;
  email: string;
  imageUrl: string;
};

@Component({
  selector: 'ngm-dev-block-contact-section-10',
  templateUrl: './contact-section-10.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class ContactSection10Component {
  team: TeamMember[] = [
    {
      name: 'Rachel Green',
      role: 'Customer Success',
      email: 'rachel@company.com',
      imageUrl: 'https://placehold.co/400x400/8b5cf6/ffffff?text=RG',
    },
    {
      name: 'James Wilson',
      role: 'Technical Support',
      email: 'james@company.com',
      imageUrl: 'https://placehold.co/400x400/3b82f6/ffffff?text=JW',
    },
    {
      name: 'Maria Garcia',
      role: 'Sales Manager',
      email: 'maria@company.com',
      imageUrl: 'https://placehold.co/400x400/ec4899/ffffff?text=MG',
    },
    {
      name: 'David Chen',
      role: 'Account Executive',
      email: 'david@company.com',
      imageUrl: 'https://placehold.co/400x400/10b981/ffffff?text=DC',
    },
  ];
}
