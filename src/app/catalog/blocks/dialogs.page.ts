import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CatalogPage } from '../shared/catalog-page/catalog-page';
import { buildCatalogStub, findCatalogEntry } from '../shared/catalog-registry';

@Component({
  selector: 'app-dialogs-catalog-page',
  imports: [CatalogPage],
  template: `<app-catalog-page [meta]="meta" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsCatalogPage {
  // M1 stub — full variants/API/best practices populated by subagent task E
  protected readonly meta = buildCatalogStub(findCatalogEntry('dialogs')!);
}
