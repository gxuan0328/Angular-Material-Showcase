/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update file-upload/file-upload-5`
*/

import { Component, HostListener, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  AcceptService,
  DropzoneComponent,
  DropzoneService,
  FileInputDirective,
} from '@ngx-dropzone/cdk';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'ngm-dev-block-file-upload5-dropzone',
  imports: [MatIcon],
  providers: [DropzoneService, AcceptService],
  template: `<ng-content select="[fileInput]" />
    <div
      [class]="
        (isDragover ? 'border-primary bg-primary-container ' : ' ') +
        'mt-2 flex justify-center rounded border-2 border-dashed border-gray-300 px-6 py-20 dark:border-gray-700 pointer-events-none'
      "
    >
      <div>
        <mat-icon
          class="mx-auto block! [font-size:48px]! size-[1em]! text-on-surface-variant"
        >
          attach_file
        </mat-icon>
        <div class="mt-4 flex leading-6">
          <p>Drag and drop or</p>
          <span
            role="button"
            class="relative pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
          >
            choose file(s)
          </span>
          <p class="pl-1">to upload</p>
        </div>
        <p class="text-center text-sm leading-5 text-on-surface-variant mt-2">
          XLSX, XLS, CSV up to 25MB
        </p>
      </div>
    </div> `,
  styles: [':host { cursor: pointer; }'],
})
export class FileUpload5DropzoneComponent extends DropzoneComponent {
  @HostListener('click')
  onClick() {
    this.openFilePicker();
  }
}

@Component({
  selector: 'ngm-dev-block-file-upload-5',
  templateUrl: './file-upload-5.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FileInputDirective,
    MatChipsModule,
    MatProgressBarModule,
    MatListModule,
    FileUpload5DropzoneComponent,
  ],
})
export class FileUpload5Component {
  private _fb = inject(FormBuilder);
  form = this._fb.group({
    file: this._fb.control<File[]>([], Validators.required),
  });
  inprogressFiles: { name: string; progress: number; size: string }[] = [
    {
      name: 'Revenue_Q1_2024.xlsx',
      progress: 50,
      size: '5.7 MB',
    },
    {
      name: 'Revenue_Q2_2024.xlsx',
      progress: 71,
      size: '12.5 MB',
    },
  ];
  completedFiles: { name: string; size: string }[] = [
    {
      name: 'Yearly_Report_2024.pdf',
      size: '1.5 MB',
    },
    {
      name: 'Forecast_Q3_2024.csv',
      size: '2.9 MB',
    },
  ];

  get filesCtrl() {
    return this.form.get('file')!;
  }

  get files() {
    const _files = this.filesCtrl.value;

    if (!_files) return [];
    return Array.isArray(_files) ? _files : [_files];
  }

  remove(file: File) {
    const value = this.filesCtrl.value;
    if (Array.isArray(value)) {
      this.filesCtrl.setValue((value as File[]).filter((i) => i !== file));
      return;
    }

    this.filesCtrl.setValue(null);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    }
  }

  onCancel(): void {
    this.form.reset();
  }
}
