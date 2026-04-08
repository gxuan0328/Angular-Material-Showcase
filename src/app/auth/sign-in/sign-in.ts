import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  template: `
    <h1>登入</h1>
    <p>M0 placeholder — real form lands in M2.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {}
