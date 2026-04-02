<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  value: number
  suffix?: string
  label: string
  animated?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  suffix: '',
  animated: true,
  duration: 2000,
})

const displayValue = ref(props.animated ? 0 : props.value)
const cardRef = ref<HTMLDivElement>()
const hasAnimated = ref(false)
let observer: IntersectionObserver | null = null

function easeOutQuad(t: number): number {
  return t * (2 - t)
}

function animateCounter() {
  if (hasAnimated.value || !props.animated) return
  hasAnimated.value = true

  const startTime = performance.now()
  const startValue = 0
  const endValue = props.value

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const eased = easeOutQuad(progress)
    displayValue.value = Math.round(startValue + (endValue - startValue) * eased)

    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)
}

watch(() => props.value, (newVal) => {
  if (!props.animated || !hasAnimated.value) {
    displayValue.value = newVal
    return
  }
  // Re-animate on value change
  hasAnimated.value = false
  animateCounter()
})

onMounted(() => {
  if (!props.animated) {
    displayValue.value = props.value
    return
  }

  if (!cardRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounter()
        observer?.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  observer.observe(cardRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="cardRef" class="text-center">
    <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-prado-text mb-2">
      {{ displayValue }}{{ suffix }}
    </div>
    <div class="text-prado-text-secondary text-base leading-snug">
      {{ label }}
    </div>
  </div>
</template>
