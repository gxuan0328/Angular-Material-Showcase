/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update free-fancy/memory-album`
*/

import { Component, inject } from '@angular/core';
import { randomInt } from '../../utils/functions/random';
import {
  DragElementDirective,
  DragElementsComponent,
} from '../../components/drag-elements/drag-elements.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DeviceService } from '../../utils/services/device.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-memory-album',
  templateUrl: './memory-album.component.html',
  imports: [
    DragElementsComponent,
    DragElementDirective,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class MemoryAlbumComponent {
  readonly images: {
    url: string;
    rotation: number;
    width: number;
    height: number;
  }[] = [
    'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFjYXRpb258ZW58MHx8MHx8fDI%3D',
    'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmFjYXRpb258ZW58MHx8MHx8fDI%3D',
    'https://images.unsplash.com/photo-1566371486490-560ded23b5e4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhY2F0aW9ufGVufDB8fDB8fHwy',
    'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmFjYXRpb258ZW58MHx8MHx8fDI%3D',
    'https://images.unsplash.com/photo-1622137276920-2351359e3450?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZhY2F0aW9ufGVufDB8fDB8fHwy',
    'https://images.unsplash.com/photo-1618064541372-289bdb6f5b7b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHZhY2F0aW9ufGVufDB8fDB8fHwy',
  ].map((url) => ({
    url,
    rotation: randomInt(-12, 12),
    width: randomInt(120, 140),
    height: randomInt(150, 180),
  }));

  isHandSet$ = inject(DeviceService).isHandset$;
}
