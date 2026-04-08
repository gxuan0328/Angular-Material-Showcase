import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-catalog-index',
  template: `
    <h1>Catalog</h1>
    <p>M0 placeholder — category pages land in M1.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogIndex {}
