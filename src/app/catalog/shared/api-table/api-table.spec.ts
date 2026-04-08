import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ApiDocumentation, EMPTY_API } from '../../models/api-documentation';

import { ApiTable } from './api-table';

describe('ApiTable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ApiTable],
    });
  });

  it('renders the empty placeholder when api has no entries', async () => {
    const fixture = TestBed.createComponent(ApiTable);
    fixture.componentRef.setInput('api', EMPTY_API);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('純展示型 block');
  });

  it('renders only sections that have entries', async () => {
    const api: ApiDocumentation = {
      inputs: [
        {
          name: 'tone',
          type: "'info' | 'warn'",
          default: "'info'",
          required: false,
          description: '色調',
        },
      ],
      outputs: [],
      slots: [],
      cssProperties: [
        {
          name: '--banner-bg',
          type: 'color',
          default: 'var(--mat-sys-surface)',
          required: false,
          description: '背景色',
        },
      ],
    };
    const fixture = TestBed.createComponent(ApiTable);
    fixture.componentRef.setInput('api', api);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const headings = Array.from(el.querySelectorAll<HTMLElement>('.api-table__heading')).map(
      h => h.textContent?.trim() ?? '',
    );
    expect(headings).toEqual(['Inputs', 'CSS Custom Properties']);
  });
});
