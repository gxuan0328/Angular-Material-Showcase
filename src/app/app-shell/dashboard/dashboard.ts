import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>儀表板</h1>
    <p>M0 placeholder — dashboard content lands in M2.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
