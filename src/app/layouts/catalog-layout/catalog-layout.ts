import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-catalog-layout',
  imports: [RouterOutlet],
  templateUrl: './catalog-layout.html',
  styleUrl: './catalog-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'catalog-layout' },
})
export class CatalogLayout {}
