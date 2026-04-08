/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/word-rotate`
*/

import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  numberAttribute,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Possible animation directions
 */
export type WordRotateDirection = 'up' | 'down';

/**
 * Animation state for the word
 */
type AnimationState = 'initial' | 'enter' | 'exit';

@Component({
  selector: 'ngm-dev-block-ui-word-rotate',
  templateUrl: './word-rotate.component.html',

  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordRotateComponent implements OnDestroy, AfterViewInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  classes = input('', { alias: 'class' });
  /**
   * Array of words to rotate through
   */
  words = input<string[]>([]);

  /**
   * Duration between word changes in ms
   * @default 2500
   */
  duration = input(2500, {
    transform: numberAttribute,
  });

  /**
   * Duration of the animation transition in seconds
   * @default 0.25
   */
  animationDuration = input(0.25, {
    transform: numberAttribute,
  });

  /**
   * Direction of the animation
   * - 'up': Current word goes up and disappears, next word comes from bottom
   * - 'down': Current word goes down and disappears, next word comes from top
   * @default 'up'
   */
  direction = input<WordRotateDirection>('up');

  /**
   * Current word index
   */
  private currentIndex = signal(0);

  /**
   * Current word to display
   */
  currentWord = computed(() => {
    const wordsArray = this.words();
    return wordsArray.length > 0 ? wordsArray[this.currentIndex()] : '';
  });

  /**
   * Maximum width of all words
   */
  maxWordWidth = signal('auto');

  /**
   * Current animation state
   */
  animationState = signal<AnimationState>('initial');

  /**
   * CSS transform value based on animation state and direction
   */
  transformValue = computed(() => {
    const state = this.animationState();
    const { exitY, enterY } = this.getAnimationValues();

    switch (state) {
      case 'initial':
        return enterY;
      case 'exit':
        return exitY;
      case 'enter':
      default:
        return 'translateY(0)';
    }
  });

  /**
   * CSS opacity value based on animation state
   */
  opacityValue = computed(() => {
    const state = this.animationState();
    return state === 'enter' ? '1' : '0';
  });

  /**
   * CSS transition value based on animation state and animationDuration
   */
  transitionValue = computed(() => {
    const state = this.animationState();
    const duration = this.animationDuration();
    return state === 'initial'
      ? 'none'
      : `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
  });

  /**
   * Reference to the word element
   */
  wordElementRef = viewChild<ElementRef>('wordElement');

  /**
   * Interval ID for cleanup
   */
  private intervalId: number | null = null;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private document = inject(DOCUMENT);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // Set up the interval to change words
    afterNextRender(() => {
      this.setupInterval();
    });

    // Calculate dimensions when words change
    effect(() => {
      if (this.words().length > 0) {
        this.calculateWordDimensions();
      }
    });
  }

  /**
   * Sets up the interval to change words based on the duration
   */
  private setupInterval(): void {
    // Clear existing interval if it exists
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }

    // Run the interval outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = window.setInterval(() => {
        this.animateWordRotation();
      }, this.duration());
    });
  }

  /**
   * Calculate dimensions (width and height) of all words
   */
  private calculateWordDimensions(): void {
    if (!this.isBrowser || this.words().length === 0) return;

    // Run outside NgZone as this is a pure calculation
    this.ngZone.runOutsideAngular(() => {
      // Create a temporary element to measure text dimensions
      const tempElement = this.document.createElement('div');
      tempElement.style.visibility = 'hidden';
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.style.top = '-9999px';
      tempElement.style.whiteSpace = 'nowrap';
      tempElement.style.padding = '0';
      tempElement.style.margin = '0';
      tempElement.style.border = '0';
      tempElement.style.overflow = 'visible';
      tempElement.style.display = 'inline-block';

      // Copy the styles from the element if it exists
      if (this.wordElementRef()?.nativeElement) {
        const computedStyle = window.getComputedStyle(
          this.wordElementRef()!.nativeElement,
        );

        // Copy all relevant text styling properties
        const styleProps = [
          'font',
          'fontSize',
          'fontWeight',
          'fontFamily',
          'letterSpacing',
          'textTransform',
          'lineHeight',
          'textAlign',
          'whiteSpace',
          'fontStyle',
          'fontVariant',
          'fontStretch',
        ];

        styleProps.forEach((prop) => {
          tempElement.style[prop as any] = computedStyle[prop as any];
        });
      }

      // Add to DOM
      this.document.body.appendChild(tempElement);

      // Measure each word and find the maximum dimensions
      let maxWidth = 0;
      let maxHeight = 0;
      const currentClasses =
        this.wordElementRef()?.nativeElement.className || '';

      this.words().forEach((word) => {
        // Add the same classes as the actual element
        tempElement.className = currentClasses;
        tempElement.textContent = word;

        const rect = tempElement.getBoundingClientRect();
        maxWidth = Math.max(maxWidth, rect.width);
        maxHeight = Math.max(maxHeight, rect.height);
      });

      // Remove the temporary element
      this.document.body.removeChild(tempElement);

      // Add a small buffer to prevent edge cases
      this.maxWordWidth.set(`${Math.ceil(maxWidth + 10)}px`);

      // Only set a height if we actually measured something
      //   if (maxHeight > 0) {
      //     this.maxWordHeight.set(`${Math.ceil(maxHeight + 5)}px`);
      //   }
    });
  }

  /**
   * Get the animation values based on direction
   */
  private getAnimationValues(): { exitY: string; enterY: string } {
    const currentDirection = this.direction();

    if (currentDirection === 'down') {
      // For down direction:
      // - Current word moves down and disappears (+50px)
      // - Next word comes from top (-50px)
      return {
        exitY: 'translateY(50px)',
        enterY: 'translateY(-50px)',
      };
    }

    // Default is 'up':
    // - Current word moves up and disappears (-50px)
    // - Next word comes from bottom (+50px)
    return {
      exitY: 'translateY(-50px)',
      enterY: 'translateY(50px)',
    };
  }

  /**
   * Animates the word rotation using CSS transitions
   */
  private animateWordRotation(): void {
    if (!this.wordElementRef || !this.isBrowser) return;

    // Start exit animation
    this.animationState.set('exit');

    // Wait for exit animation
    const animDurationMs = this.animationDuration() * 1000;
    setTimeout(() => {
      // Update word
      this.currentIndex.update((index) => (index + 1) % this.words().length);

      // Set initial state (without transition)
      this.animationState.set('initial');

      // Force reflow
      //   void this.wordElementRef()!.nativeElement.offsetWidth;

      // Wait for the content to update
      setTimeout(() => {
        // Start enter animation
        this.animationState.set('enter');

        // We need to manually trigger change detection since we're running outside NgZone
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });
      }, 20);
    }, animDurationMs);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    // Calculate dimensions now that we have the element
    if (this.maxWordWidth() === 'auto') {
      this.calculateWordDimensions();
    }

    // Start with initial state
    this.animationState.set('initial');

    // Run the animation setup outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      // Animate in after a short delay
      setTimeout(() => {
        this.animationState.set('enter');

        // We need to manually trigger change detection
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });
      }, 100);
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    // Clean up interval on component destroy
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }
  }
}
