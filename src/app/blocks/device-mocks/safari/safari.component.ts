/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update device-mocks/safari`
*/

import { Component, input, computed } from '@angular/core';

const SAFARI_WIDTH = 1203;
const SAFARI_HEIGHT = 753;
const SCREEN_X = 1;
const SCREEN_Y = 52;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 700;

// Calculated percentages
const LEFT_PCT = (SCREEN_X / SAFARI_WIDTH) * 100;
const TOP_PCT = (SCREEN_Y / SAFARI_HEIGHT) * 100;
const WIDTH_PCT = (SCREEN_WIDTH / SAFARI_WIDTH) * 100;
const HEIGHT_PCT = (SCREEN_HEIGHT / SAFARI_HEIGHT) * 100;

type SafariMode = 'default' | 'simple';

@Component({
  selector: 'ngm-dev-block-ui-device-mocks-safari',
  templateUrl: './safari.component.html',
})
export class DeviceMockSafariComponent {
  url = input<string>();
  imageSrc = input<string>();
  videoSrc = input<string>();
  imageClass = input<string>('');
  mode = input<SafariMode>('default');

  // Computed values
  hasVideo = computed(() => !!this.videoSrc());
  hasImage = computed(() => !!this.imageSrc());
  hasMedia = computed(() => this.hasVideo() || this.hasImage());

  // Constants exposed to template
  readonly SAFARI_WIDTH = SAFARI_WIDTH;
  readonly SAFARI_HEIGHT = SAFARI_HEIGHT;
  readonly LEFT_PCT = LEFT_PCT;
  readonly TOP_PCT = TOP_PCT;
  readonly WIDTH_PCT = WIDTH_PCT;
  readonly HEIGHT_PCT = HEIGHT_PCT;
}
