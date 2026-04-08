/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-6`
*/

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  ElementRef,
  afterNextRender,
} from '@angular/core';

@Component({
  selector: 'ngm-dev-block-feature-section-6-globe',
  template: `<canvas
    style="width: 800px; height: 800px"
    class="absolute -right-72 top-40 z-10 aspect-square size-full max-w-fit transition-transform group-hover:scale-[1.01] sm:top-12 lg:-right-60 lg:top-0"
    data-testid="feature-section-6-globe-canvas"
  ></canvas>`,
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
export class FeatureSection6GlobeComponent implements OnDestroy {
  private canvasRef = inject(ElementRef);
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
  initGlobe(createGlobe: any) {
    let phi = 4;
    const canvas = this.canvasRef.nativeElement.querySelector('canvas');

    if (canvas) {
      this.globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: 800 * 2,
        height: 800 * 2,
        phi: 0,
        theta: -0.3,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 30000,
        mapBrightness: 13,
        mapBaseBrightness: 0.01,
        baseColor: [1, 1, 1],
        glowColor: [1, 1, 1],
        markerColor: [100, 100, 100],
        markers: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRender: (state: any) => {
          state['phi'] = phi;
          phi += 0.0005;
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.globe) {
      this.globe.destroy();
    }
  }
}
