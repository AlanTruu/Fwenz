# Sass Style Guide

This directory contains the refactored Sass styles for the MERN app. The structure is designed to eliminate repetition and make styling more maintainable.

## Directory Structure

```
styles/
├── _variables.scss      # Global variables (colors, spacing, etc.)
├── _mixins.scss         # Reusable mixins
├── main.scss           # Main styles file with global styles
├── components/         # Component-specific styles
│   ├── _index.scss     # Exports all component styles
│   ├── _button.scss    # Button component styles
│   ├── _login.scss     # Login component styles
│   └── _userMenu.scss  # UserMenu component styles
└── README.md           # This file
```

## Key Features

### Variables
- **Colors**: `$primary-color`, `$dark-bg`, `$white`, etc.
- **Spacing**: `$spacing-xs`, `$spacing-sm`, `$spacing-md`, etc.
- **Sizes**: `$input-width`, `$button-height`, etc.
- **Breakpoints**: `$mobile`, `$tablet`

### Mixins
- **Buttons**: `@include button-base`, `@include button-danger`
- **Inputs**: `@include input-base`
- **Containers**: `@include auth-container`, `@include page-container`
- **Responsive**: `@include mobile`, `@include tablet`
- **Utilities**: `@include flex-center`, `@include circle($size)`

## How to Use

### 1. In Component Files
Replace your CSS imports with Sass:

```jsx
// Before
import styles from '../theme/Button.module.css'

// After
import styles from '../styles/components/button.module.scss'
```

### 2. Creating New Components
1. Create a new file in `components/` (e.g., `_newComponent.scss`)
2. Import variables and mixins at the top:
   ```scss
   @import '../variables';
   @import '../mixins';
   ```
3. Use mixins and variables:
   ```scss
   .myComponent {
     @include button-base;
     color: $primary-color;
     margin: $spacing-lg;
   }
   ```
4. Add the import to `components/_index.scss`

### 3. Responsive Design
Use the responsive mixins:

```scss
.myComponent {
  // Mobile styles
  
  @include tablet {
    // Tablet and up styles
  }
}
```

## Benefits

1. **DRY Principle**: No more repeated CSS properties
2. **Consistency**: All buttons, inputs, etc. use the same base styles
3. **Maintainability**: Change colors/sizes in one place
4. **Type Safety**: Sass variables provide better IDE support
5. **Nesting**: Cleaner, more readable code structure

## Migration Steps

1. Convert existing CSS files to Sass (`.scss`)
2. Update component imports
3. Replace repeated properties with mixins
4. Test all components work correctly
5. Remove old CSS files

## Common Patterns

### Button Styling
```scss
.primaryButton {
  @include button-base;
}

.dangerButton {
  @include button-danger;
}
```

### Form Inputs
```scss
.textInput {
  @include input-base;
}
```

### Page Layouts
```scss
.authPage {
  @include page-container;
  
  .container {
    @include auth-container;
  }
}
``` 