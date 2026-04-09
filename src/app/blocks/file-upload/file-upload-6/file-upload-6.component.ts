/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update file-upload/file-upload-6`
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

@Component({
  selector: 'ngm-dev-block-file-upload6-dropzone',
  imports: [MatIcon],
  providers: [DropzoneService, AcceptService],
  template: `<ng-content select="[fileInput]" />
    <div
      [class]="
        'mt-4 flex justify-center space-x-4 rounded border border-dashed border-outline px-6 py-10 ' +
        (isDragover ? 'border-primary bg-primary-container' : '')
      "
    >
      <div class="sm:flex sm:items-center sm:space-x-3">
        <mat-icon
          class="mx-auto sm:mx-0 block! [font-size:48px]! sm:[font-size:32px]! size-[1em]! text-on-surface-variant!"
          >upload</mat-icon
        >
        <div class="mt-4 sm:mt-0 flex leading-6">
          <p>Drag and drop or</p>
          <span
            role="button"
            class="relative pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
          >
            choose file
          </span>
          <p class="pl-1">to upload</p>
        </div>
      </div>
    </div>`,
  styles: [':host { cursor: pointer; }'],
})
export class FileUpload6DropzoneComponent extends DropzoneComponent {
  @HostListener('click')
  onClick() {
    this.openFilePicker();
  }
}

@Component({
  selector: 'ngm-dev-block-file-upload-6',
  templateUrl: './file-upload-6.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FileInputDirective,
    FileUpload6DropzoneComponent,
  ],
})
export class FileUpload6Component {
  private _fb = inject(FormBuilder);
  form = this._fb.group({
    file: this._fb.control<File[]>([], Validators.required),
  });

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
