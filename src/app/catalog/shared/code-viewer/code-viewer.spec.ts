import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CodeViewer } from './code-viewer';

describe('CodeViewer', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      imports: [CodeViewer],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('fetches the baked JSON for the supplied category/variant', async () => {
    const fixture = TestBed.createComponent(CodeViewer);
    fixture.componentRef.setInput('category', 'free-page-shells');
    fixture.componentRef.setInput('variant', 'page-shell-1');
    // Flush the constructor effect that issues the HTTP request
    TestBed.tick();

    const req = httpTesting.expectOne('assets/block-sources/free-page-shells__page-shell-1.json');
    expect(req.request.method).toBe('GET');
    req.flush({
      category: 'free-page-shells',
      variant: 'page-shell-1',
      files: {
        'page-shell-1.component.ts': 'export class PageShell1Component {}',
        'page-shell-1.component.html': '<div>hi</div>',
      },
    });

    // Wait for the awaited firstValueFrom + signal write microtask, then re-flush
    await fixture.whenStable();
    TestBed.tick();
    await fixture.whenStable();

    const tabs = fixture.nativeElement.querySelectorAll('.code-viewer__tab');
    expect(tabs.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('PageShell1Component');
  });
});
