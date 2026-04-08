import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { BlockVariant } from '../../models/block-variant';

import { VariantSelector } from './variant-selector';

class StubComponent {}

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'page-shell-1',
    label: 'Page Shell 1',
    registryCategory: 'free-page-shells',
    component: StubComponent,
    isFree: true,
  },
  {
    id: 'page-shell-2',
    label: 'Page Shell 2',
    registryCategory: 'page-shells',
    component: StubComponent,
    isFree: false,
  },
  {
    id: 'page-shell-3',
    label: 'Page Shell 3',
    registryCategory: 'page-shells',
    component: StubComponent,
    isFree: false,
  },
];

describe('VariantSelector', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [VariantSelector],
    });
  });

  it('renders all variants grouped by free / paid', async () => {
    const fixture = TestBed.createComponent(VariantSelector);
    fixture.componentRef.setInput('variants', VARIANTS);
    fixture.componentRef.setInput('selectedId', 'page-shell-1');
    await fixture.whenStable();

    const optgroups = fixture.nativeElement.querySelectorAll('optgroup');
    expect(optgroups.length).toBe(2);
    expect(optgroups[0].getAttribute('label')).toBe('Free');
    expect(optgroups[1].getAttribute('label')).toBe('Paid');
  });

  it('shows the total count', async () => {
    const fixture = TestBed.createComponent(VariantSelector);
    fixture.componentRef.setInput('variants', VARIANTS);
    fixture.componentRef.setInput('selectedId', 'page-shell-1');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('共 3 種變體');
  });

  it('emits selectionChange when select element changes', async () => {
    const fixture = TestBed.createComponent(VariantSelector);
    fixture.componentRef.setInput('variants', VARIANTS);
    fixture.componentRef.setInput('selectedId', 'page-shell-1');
    await fixture.whenStable();

    const emitted: string[] = [];
    fixture.componentInstance.selectionChange.subscribe((id: string) => emitted.push(id));

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'page-shell-2';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(emitted).toEqual(['page-shell-2']);
  });
});
