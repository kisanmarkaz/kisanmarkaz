# Scroll Animation Components

This document explains how to use the scroll animation components in the KisanMarkaz project.

## Available Components

### 1. GlobalScrollAnimations

This component adds site-wide scroll effects like the progress bar and scroll indicator. It's already included in the App.tsx file, so you don't need to add it anywhere else.

### 2. ScrollReveal

A component that reveals its children with an animation when they enter the viewport.

```tsx
import ScrollReveal from '@/components/ScrollReveal';

// Basic usage
<ScrollReveal>
  <YourComponent />
</ScrollReveal>

// With options
<ScrollReveal 
  variant="slideUp" 
  delay={0.2} 
  threshold={0.3}
  once={false}
>
  <YourComponent />
</ScrollReveal>
```

#### Props:
- `variant`: Animation type ('fadeIn', 'slideUp', 'slideInLeft', 'slideInRight', 'scaleUp')
- `delay`: Delay before animation starts (in seconds)
- `duration`: Animation duration (in seconds)
- `threshold`: How much of the element needs to be in view to trigger the animation (0-1)
- `once`: Whether the animation should only play once
- `className`: Additional CSS classes

### 3. ScrollAnimatedSection

A more advanced component that adds scroll animations with additional effects like parallax.

```tsx
import ScrollAnimatedSection from '@/components/ScrollAnimatedSection';

<ScrollAnimatedSection 
  direction="up" 
  threshold={0.2} 
  delay={0.1}
  staggerChildren={true}
>
  <div>Child 1</div>
  <div>Child 2</div>
</ScrollAnimatedSection>
```

#### Props:
- `direction`: Animation direction ('up', 'down', 'left', 'right', 'none')
- `delay`: Delay before animation starts (in seconds)
- `duration`: Animation duration (in seconds)
- `threshold`: How much of the element needs to be in view to trigger the animation (0-1)
- `once`: Whether the animation should only play once
- `staggerChildren`: Whether to stagger the animations of children
- `staggerDelay`: Delay between each child's animation (in seconds)
- `distance`: Distance to animate from (in pixels)
- `className`: Additional CSS classes

### 4. ScrollAnimatedElement

A simple component that uses the useScrollAnimation hook to apply animations.

```tsx
import ScrollAnimatedElement from '@/components/ScrollAnimatedElement';

<ScrollAnimatedElement direction="left" delay={0.3}>
  <YourComponent />
</ScrollAnimatedElement>
```

#### Props:
- `direction`: Animation direction ('up', 'down', 'left', 'right', 'none')
- `delay`: Delay before animation starts (in seconds)
- `duration`: Animation duration (in seconds)
- `threshold`: How much of the element needs to be in view to trigger the animation (0-1)
- `once`: Whether the animation should only play once
- `className`: Additional CSS classes

## Custom Hook: useScrollAnimation

For more control, you can use the useScrollAnimation hook directly:

```tsx
import useScrollAnimation from '@/hooks/useScrollAnimation';

const MyComponent = () => {
  const { ref, classes, style, isInView } = useScrollAnimation({
    direction: 'up',
    threshold: 0.2,
    delay: 0.3,
    duration: 0.6,
    once: true
  });

  return (
    <div ref={ref} className={`my-class ${classes}`} style={style}>
      {isInView ? 'I am visible!' : 'Not yet visible'}
    </div>
  );
};
```

## CSS Animation Classes

The following CSS animation classes are available for use directly in your components:

- `animate-float`: Gentle floating animation
- `animate-pulse-slow`: Slow pulsing animation
- `animate-slide-up`: Slide up and fade in
- `animate-slide-down`: Slide down and fade in
- `animate-slide-left`: Slide left and fade in
- `animate-slide-right`: Slide right and fade in

Example:
```tsx
<div className="animate-float">
  I float up and down!
</div>
```