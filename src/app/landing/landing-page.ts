import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  template: `
    <section class="landing-page">
      <h1>Glacier Analytics</h1>
      <p>M0 placeholder — landing page content lands in M2.</p>
    </section>
  `,
  styles: `
    .landing-page {
      max-width: 960px;
      margin: 0 auto;
      padding: 4rem 1rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {}
