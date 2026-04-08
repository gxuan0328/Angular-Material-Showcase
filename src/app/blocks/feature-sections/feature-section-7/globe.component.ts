/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-7`
*/

import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'ngm-dev-block-feature-section-7-globe',
  template: `
    <canvas
      class="absolute top-[10rem] z-20 aspect-square size-full max-w-fit sm:top-[7.1rem] md:top-[12rem]"
      style="width: 1200px; height: 1200px"
      data-testid="feature-section-7-globe-canvas"
    >
    </canvas>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection7GlobeComponent implements OnDestroy {
  private elementRef = inject(ElementRef);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private globe: any | undefined;

  constructor() {
    afterNextRender(() => {
      import('cobe').then(({ default: createGlobe }) => {
        this.initGlobe(createGlobe);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initGlobe(createGlobe: any) {
    const canvas = this.elementRef.nativeElement.querySelector('canvas');
    if (!canvas) return;

    let phi = 4.7;
    this.globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1200 * 2,
      height: 1200 * 2,
      phi: 0,
      theta: -0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 25000,
      mapBrightness: 13,
      mapBaseBrightness: 0.05,
      baseColor: [0.3, 0.3, 0.3],
      glowColor: [0.15, 0.15, 0.15],
      markerColor: [100, 100, 100],
      markers: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onRender: (state: any) => {
        state['phi'] = phi;
        phi += 0.0002;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.globe) {
      this.globe.destroy();
    }
  }
}
