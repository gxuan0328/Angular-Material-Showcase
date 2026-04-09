/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/narrow-with-small-avatars`
*/

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class NarrowWithSmallAvatarsService {
  private _http = inject(HttpClient);
  private _href =
    'https://api.github.com/search/issues?q=repo:angular/components&sort=created&per_page=10';

  getIssues() {
    return this._http.get<any>(this._href).pipe(map((res) => res.items));
  }
}
