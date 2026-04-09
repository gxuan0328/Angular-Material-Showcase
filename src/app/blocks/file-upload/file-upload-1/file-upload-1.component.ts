/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update file-upload/file-upload-1`
*/

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// npm i @ngx-dropzone/cdk @ngx-dropzone/material
import { FileInputDirective } from '@ngx-dropzone/cdk';
import { MatDropzone } from '@ngx-dropzone/material';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'ngm-dev-block-file-upload-1',
  templateUrl: './file-upload-1.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FileInputDirective,
    MatDropzone,
    MatChipsModule,
  ],
})
export class FileUpload1Component {
  private _fb = inject(FormBuilder);
  form = this._fb.group({
    workspaceName: ['', Validators.required],
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
