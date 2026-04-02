<script setup lang="ts">
import { computed, resolveComponent, type Component } from 'vue'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: Component
  iconPosition?: 'left' | 'right'
  to?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  type: 'button',
})

defineSlots<{
  default(): unknown
}>()

const isDisabled = computed(() => props.disabled || props.loading)

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-prado-orange text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-prado-orange/50',
  secondary:
    'bg-prado-sage text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-prado-sage/50',
  outline:
    'border border-prado-sage text-prado-sage bg-transparent hover:bg-prado-sage/10 focus-visible:ring-2 focus-visible:ring-prado-sage/50',
  ghost:
    'bg-transparent text-prado-text hover:bg-prado-surface-hover focus-visible:ring-2 focus-visible:ring-prado-sage/50',
  destructive:
    'bg-destructive text-destructive-foreground hover:brightness-110 focus-visible:ring-2 focus-visible:ring-destructive/50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
}

const iconSizeMap: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none',
  variantClasses[props.variant],
  sizeClasses[props.size],
  isDisabled.value && 'opacity-50 pointer-events-none',
])

const linkComponent = computed(() => {
  if (!props.to) return null
  try {
    const resolved = resolveComponent('NuxtLink')
    return typeof resolved === 'string' ? 'a' : resolved
  } catch {
    return 'a'
  }
})

const linkProps = computed(() => {
  if (!props.to) return {}
  if (linkComponent.value === 'a') {
    return { href: props.to }
  }
  return { to: props.to }
})
</script>

<template>
  <component
    :is="linkComponent ?? 'button'"
    v-bind="linkProps"
    :class="classes"
    :disabled="linkComponent ? undefined : isDisabled"
    :type="linkComponent ? undefined : type"
    :aria-disabled="isDisabled || undefined"
    :tabindex="isDisabled ? -1 : undefined"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin shrink-0"
      :width="iconSizeMap[size]"
      :height="iconSizeMap[size]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>

    <!-- Left icon -->
    <component
      v-else-if="icon && iconPosition === 'left'"
      :is="icon"
      :size="iconSizeMap[size]"
      class="shrink-0"
    />

    <span>
      <slot />
    </span>

    <!-- Right icon -->
    <component
      v-if="!loading && icon && iconPosition === 'right'"
      :is="icon"
      :size="iconSizeMap[size]"
      class="shrink-0"
    />
  </component>
</template>
