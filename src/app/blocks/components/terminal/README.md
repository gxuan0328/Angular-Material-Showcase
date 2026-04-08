# Terminal Component

A Material 3 styled terminal UI component for Angular applications. This component mimics a command-line interface with animation capabilities.

## Features

- Stylish terminal-like UI with colored control dots
- Animated text appearance
- Text typing animation
- Custom styling support
- Built with Material 3 design principles using Tailwind CSS

## Components

The terminal package includes three main components:

1. `TerminalComponent` - The main terminal UI container
2. `AnimatedSpanComponent` - For animated text that fades in
3. `TypingAnimationComponent` - For text that appears character by character

## Usage

```typescript
// In your component
import {
  TerminalComponent,
  AnimatedSpanComponent,
  TypingAnimationComponent,
} from '@your-lib/ui/components/terminal';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [
    CommonModule,
    TerminalComponent,
    AnimatedSpanComponent,
    TypingAnimationComponent,
  ],
  template: `
    <ngm-dev-block-ui-terminal className="my-custom-class">
      <!-- Simple animated text with 100ms delay -->
      <ngm-dev-block-ui-animated-span [delay]="100">
        $ npm install @angular/material
      </ngm-dev-block-ui-animated-span>

      <!-- Typing animation with custom timing -->
      <ngm-dev-block-ui-typing-animation
        text="Installing packages..."
        [delay]="500"
        [duration]="40"
      >
      </ngm-dev-block-ui-typing-animation>
    </ngm-dev-block-ui-terminal>
  `,
})
export class YourComponent {}
```

## Styling

The terminal uses Tailwind CSS classes by default but you can customize the appearance using the `className` input.

## Animation Properties

### AnimatedSpanComponent

- `delay`: Number of milliseconds to delay the animation (default: 0)
- `className`: Additional CSS classes

### TypingAnimationComponent

- `text`: The text to be typed
- `duration`: Duration between character appearances in milliseconds (default: 60)
- `delay`: Delay before typing starts in milliseconds (default: 0)
- `className`: Additional CSS classes
