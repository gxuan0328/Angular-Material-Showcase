/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-fancy/words-album`
*/

import { Component } from '@angular/core';
import {
  DragElementDirective,
  DragElementsComponent,
} from '../../components/drag-elements/drag-elements.component';

@Component({
  selector: 'ngm-dev-block-words-album',
  templateUrl: './words-album.component.html',
  imports: [DragElementsComponent, DragElementDirective],
})
export class WordsAlbumComponent {}
