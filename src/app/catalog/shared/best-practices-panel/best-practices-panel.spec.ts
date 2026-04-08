import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { BestPracticeNotes, EMPTY_BEST_PRACTICES } from '../../models/best-practice-notes';

import { BestPracticesPanel } from './best-practices-panel';

describe('BestPracticesPanel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [BestPracticesPanel],
    });
  });

  it('renders empty placeholder when notes have no entries', async () => {
    const fixture = TestBed.createComponent(BestPracticesPanel);
    fixture.componentRef.setInput('notes', EMPTY_BEST_PRACTICES);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('尚未撰寫');
  });

  it('renders four cards with the supplied items', async () => {
    const notes: BestPracticeNotes = {
      whenToUse: ['情境一'],
      whenNotToUse: ['情境二'],
      pitfalls: ['陷阱一'],
      accessibility: ['注意焦點順序'],
    };
    const fixture = TestBed.createComponent(BestPracticesPanel);
    fixture.componentRef.setInput('notes', notes);
    await fixture.whenStable();
    const cards = fixture.nativeElement.querySelectorAll('.best-practices-panel__card');
    expect(cards.length).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('情境一');
    expect(fixture.nativeElement.textContent).toContain('注意焦點順序');
  });
});
