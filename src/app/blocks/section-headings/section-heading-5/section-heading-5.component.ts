/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update section-headings/section-heading-5`
*/

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DeviceService } from '../../utils/services/device.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-section-heading-5',
  templateUrl: './section-heading-5.component.html',
  styleUrls: ['./section-heading-5.component.scss'],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AsyncPipe,
  ],
})
export class SectionHeading5Component {
  readonly title = 'Job Postings';
  readonly isHandset$ = inject(DeviceService).isHandset$;
}
