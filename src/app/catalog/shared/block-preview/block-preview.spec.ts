import { TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';

import { BlockVariant } from '../../models/block-variant';

import { BlockPreview } from './block-preview';

@Component({
  selector: 'app-test-stub',
  template: '<p class="test-stub-marker">stub variant content</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class StubVariantComponent {}

const VARIANT: BlockVariant = {
  id: 'stub',
  label: 'Stub',
  registryCategory: 'test',
  component: StubVariantComponent,
  isFree: true,
};

describe('BlockPreview', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [BlockPreview, StubVariantComponent],
    });
  });

  it('mounts the variant component via ngComponentOutlet', async () => {
    const fixture = TestBed.createComponent(BlockPreview);
    fixture.componentRef.setInput('variant', VARIANT);
    await fixture.whenStable();

    const marker = fixture.nativeElement.querySelector('.test-stub-marker');
    expect(marker).toBeTruthy();
    expect(marker?.textContent).toContain('stub variant content');
  });
});
