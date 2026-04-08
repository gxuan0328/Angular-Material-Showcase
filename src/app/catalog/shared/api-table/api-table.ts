import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ApiDocumentation, ApiEntry } from '../../models/api-documentation';

interface ApiSection {
  readonly title: string;
  readonly entries: readonly ApiEntry[];
}

@Component({
  selector: 'app-api-table',
  imports: [],
  templateUrl: './api-table.html',
  styleUrl: './api-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'api-table' },
})
export class ApiTable {
  readonly api = input.required<ApiDocumentation>();

  protected readonly sections = computed<readonly ApiSection[]>(() => {
    const a = this.api();
    return [
      { title: 'Inputs', entries: a.inputs },
      { title: 'Outputs', entries: a.outputs },
      { title: 'Slots', entries: a.slots },
      { title: 'CSS Custom Properties', entries: a.cssProperties },
    ].filter(s => s.entries.length > 0);
  });

  protected readonly hasAny = computed(() => this.sections().length > 0);
}
