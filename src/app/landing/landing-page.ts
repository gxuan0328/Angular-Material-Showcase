import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeaderSection1Component } from '../blocks/header-sections/header-section-1/header-section-1.component';
import { HeroSection1Component } from '../blocks/hero-sections/hero-section-1/hero-section-1.component';
import { StatsSection1Component } from '../blocks/free-stats-sections/stats-section-1/stats-section-1.component';
import { FeatureSection1Component } from '../blocks/feature-sections/feature-section-1/feature-section-1.component';
import { FeatureSection5Component } from '../blocks/feature-sections/feature-section-5/feature-section-5.component';
import { BentoGrid1Component } from '../blocks/bento-grids/bento-grid-1/bento-grid-1.component';
import { PricingSection1Component } from '../blocks/free-pricing-sections/pricing-section-1/pricing-section-1.component';
import { TestimonialSection1Component } from '../blocks/testimonial-sections/testimonial-section-1/testimonial-section-1.component';
import { BlogSection1Component } from '../blocks/free-blog-sections/blog-section-1/blog-section-1.component';
import { CtaSection1Component } from '../blocks/cta-sections/cta-section-1/cta-section-1.component';
import { NewsletterSection1Component } from '../blocks/newsletter-sections/newsletter-section-1/newsletter-section-1.component';
import { ContactSection1Component } from '../blocks/free-contact-sections/contact-section-1/contact-section-1.component';
import { MemoryAlbumComponent } from '../blocks/free-fancy/memory-album/memory-album.component';

/**
 * Glacier Analytics marketing landing page. Composes 13 vendor blocks from
 * `@ngm-dev/cli` into a single scrollable surface. Each section is a
 * self-contained vendor component — we adjust spacing via thin CSS but
 * preserve the vendor styling verbatim.
 */
@Component({
  selector: 'app-landing-page',
  imports: [
    HeaderSection1Component,
    HeroSection1Component,
    StatsSection1Component,
    FeatureSection1Component,
    FeatureSection5Component,
    BentoGrid1Component,
    PricingSection1Component,
    TestimonialSection1Component,
    BlogSection1Component,
    CtaSection1Component,
    NewsletterSection1Component,
    ContactSection1Component,
    MemoryAlbumComponent,
  ],
  template: `
    <div class="landing-page">
      <ngm-dev-block-header-section-1 class="landing-page__section landing-page__section--flush" />
      <ngm-dev-block-hero-section-1 class="landing-page__section" />
      <ngm-dev-block-stats-section-1 class="landing-page__section" />
      <ngm-dev-block-feature-section-1 class="landing-page__section" />
      <ngm-dev-block-bento-grid-1 class="landing-page__section" />
      <ngm-dev-block-feature-section-5 class="landing-page__section" />
      <ngm-dev-block-pricing-section-1 class="landing-page__section" />
      <ngm-dev-block-testimonial-section-1 class="landing-page__section" />
      <ngm-dev-block-blog-section-1 class="landing-page__section" />
      <ngm-dev-block-cta-section-1 class="landing-page__section" />
      <ngm-dev-block-memory-album class="landing-page__section landing-page__section--fancy" />
      <ngm-dev-block-newsletter-section-1 class="landing-page__section" />
      <ngm-dev-block-contact-section-1 class="landing-page__section" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      background: var(--mat-sys-surface, #fff);
      color: var(--mat-sys-on-surface, #1a1b1f);
    }
    .landing-page {
      display: flex;
      flex-direction: column;
    }
    .landing-page__section {
      display: block;
      width: 100%;
    }
    .landing-page__section + .landing-page__section {
      border-top: 1px solid var(--mat-sys-outline-variant, #c4c6d0);
    }
    .landing-page__section--flush {
      border-top: none;
    }
    .landing-page__section--fancy {
      background: var(--mat-sys-surface-container-low, #f4f3f6);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {}
