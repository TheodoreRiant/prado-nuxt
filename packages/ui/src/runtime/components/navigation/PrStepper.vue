<script setup lang="ts">
import { computed } from 'vue'

export interface PrStepperStep {
  label: string
  description?: string
}

export type PrStepStatus = 'done' | 'active' | 'pending'

interface Props {
  steps: PrStepperStep[]
  modelValue?: number
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  clickable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function getStepStatus(index: number): PrStepStatus {
  if (index < props.modelValue) return 'done'
  if (index === props.modelValue) return 'active'
  return 'pending'
}

const stepsWithStatus = computed(() =>
  props.steps.map((step, index) => ({
    ...step,
    index,
    status: getStepStatus(index),
  })),
)

function handleStepClick(index: number) {
  if (!props.clickable) return
  emit('update:modelValue', index)
}
</script>

<template>
  <nav class="w-full" aria-label="Etapes">
    <ol class="flex items-start">
      <li
        v-for="(step, index) in stepsWithStatus"
        :key="index"
        class="flex-1 flex flex-col items-center relative"
        :class="index < stepsWithStatus.length - 1 ? '' : ''"
      >
        <!-- Connector line (before the circle, between steps) -->
        <div
          v-if="index > 0"
          class="absolute top-4 -left-1/2 w-full h-0.5 -translate-y-1/2"
          :class="step.status === 'pending' ? 'bg-prado-border' : 'bg-prado-sage'"
          style="right: 50%; z-index: 0;"
        />

        <!-- Circle indicator -->
        <button
          type="button"
          class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors shrink-0"
          :class="[
            step.status === 'done'
              ? 'bg-prado-sage border-prado-sage text-white'
              : step.status === 'active'
                ? 'bg-prado-surface border-prado-sage text-prado-sage'
                : 'bg-prado-surface border-prado-border text-prado-text-muted',
            clickable ? 'cursor-pointer hover:border-prado-sage' : 'cursor-default',
          ]"
          :aria-current="step.status === 'active' ? 'step' : undefined"
          :aria-label="`Etape ${index + 1}: ${step.label}`"
          :tabindex="clickable ? 0 : -1"
          @click="handleStepClick(index)"
        >
          <!-- Checkmark for done -->
          <svg
            v-if="step.status === 'done'"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <!-- Step number for active/pending -->
          <span v-else>{{ index + 1 }}</span>
        </button>

        <!-- Label and description -->
        <div class="mt-2 text-center px-1">
          <span
            class="text-xs font-medium block"
            :class="step.status === 'active' ? 'text-prado-text' : 'text-prado-text-muted'"
          >
            {{ step.label }}
          </span>
          <span
            v-if="step.description"
            class="text-[11px] text-prado-text-faint mt-0.5 block"
          >
            {{ step.description }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>
