# Terminal Component - Usage Guide

## Including the Terminal Component in Your Angular Application

### Step 1: Import BrowserAnimationsModule

Make sure your app module or the root of your standalone app imports `BrowserAnimationsModule`:

```typescript
// In your app.module.ts or app.config.ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // ... other imports
  ],
  // ...
})
export class AppModule {}
```

### Step 2: Import and Use the Terminal Components

```typescript
// In your component file
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TerminalComponent,
  AnimatedSpanComponent,
  TypingAnimationComponent,
} from 'path/to/terminal.component';

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
    <div>
      <h3>Terminal Demo</h3>

      <!-- Pass className directly as an input property -->
      <ngm-dev-block-ui-terminal className="mb-4">
        <!-- Simple static content -->
        <div class="font-mono">$ echo "Hello Terminal"</div>
        <div>Hello Terminal</div>
      </ngm-dev-block-ui-terminal>

      <!-- Terminal with animations -->
      <ngm-dev-block-ui-terminal>
        <!-- Animated text entry -->
        <ngm-dev-block-ui-animated-span [delay]="100" className="font-mono">
          $ npm install @angular/material
        </ngm-dev-block-ui-animated-span>

        <!-- Typing animation -->
        <ngm-dev-block-ui-typing-animation
          text="Installing packages..."
          [delay]="500"
          [duration]="40"
        >
        </ngm-dev-block-ui-typing-animation>
      </ngm-dev-block-ui-terminal>
    </div>
  `,
})
export class YourComponent {}
```

## Common Issues and Solutions

### Issue: Component renders but animations don't work

Make sure:

1. `BrowserAnimationsModule` is imported in your app module
2. The `[delay]` and `[duration]` inputs are bound as numbers, not strings
3. You are using proper binding syntax with square brackets: `[delay]="100"` not `delay="100"`

### Issue: Classes not applying correctly

Each component accepts a `className` input that adds custom CSS classes:

```html
<!-- This will apply your custom classes to the terminal -->
<ngm-dev-block-ui-terminal className="mb-4 custom-class">
  <!-- content -->
</ngm-dev-block-ui-terminal>
```

Behind the scenes, we combine these with the base classes using a binding like this:

```html
<!-- How it works internally -->
<div [class]="'base-class-1 base-class-2 ' + (className || '')"></div>
```

### Issue: Content not visible

If content is not visible even though the component renders:

1. Check browser console for errors
2. Make sure the content you're providing to the terminal is valid
3. Try a simple static example first before using animations
