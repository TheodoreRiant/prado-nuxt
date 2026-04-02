# @prado/ui

Bibliothèque de composants Vue 3 / Nuxt 3 pour les projets Prado.

## Installation

```bash
npm install @prado/ui
```

## Usage avec Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@prado/ui/nuxt']
})
```

## Composants (48)

### Primitives
PrButton, PrIconButton, PrBadge, PrTag, PrAvatar

### Layout
PrCard, PrCardHeader, PrCardContent, PrCardFooter, PrDivider

### Form
PrInput, PrTextarea, PrSelect, PrCheckbox, PrRadio, PrSwitch, PrFormField,
PrTagInput, PrPhoneInput, PrMultiSelect, PrDatePicker, PrDateRangePicker, PrFileUpload

### Data
PrTable, PrDataTable, PrStatCard, PrTimeline, PrCalendar

### Feedback
PrDialog, PrAlert, PrSkeleton, PrEmptyState, PrProgress

### Navigation
PrTabs, PrAccordion, PrAccordionItem, PrBreadcrumb, PrPagination, PrStepper

### Overlay
PrTooltip, PrDropdown, PrCommandPalette

### Media
PrImageWithFallback, PrDocumentDownload

### Specialty
PrScrollExpandHero, PrCookieBanner, PrChatWidget, PrNewsletterForm

## Composables (23)

useTheme, useConfirm, useToast, useForm, usePagination, useSort, useFilter,
useBreakpoint, useDebounce, useThrottle, useLocalStorage, useSessionStorage,
useIntersectionObserver, useClipboard, useMediaQuery, useKeyboard, useClickOutside,
useScrollLock, useCountUp, useShare, useCsvExport, useAnalytics, useOnboarding

## Theming

Les composants utilisent des CSS variables `--prado-*`. Importez les tokens :

```ts
import '@prado/ui/theme/tokens.css'
```

Personnalisez en overridant les 4 variables palette :

```css
:root {
  --prado-orange: #FB6223;
  --prado-teal: #024266;
  --prado-sage: #93C1AF;
  --prado-black: #0D1F26;
}
```
