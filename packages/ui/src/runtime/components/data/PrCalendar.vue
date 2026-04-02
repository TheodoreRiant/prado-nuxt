<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface PrCalendarEvent {
  date: string
  label: string
  color?: 'sage' | 'orange' | 'teal' | 'red' | 'gray'
}

interface Props {
  modelValue?: string
  events?: PrCalendarEvent[]
  min?: string
  max?: string
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select-date': [value: string]
}>()

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const
const MONTH_NAMES = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
] as const

// Current view month/year
const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

// When modelValue changes, center on that month
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    const d = new Date(val)
    if (!isNaN(d.getTime())) {
      viewYear.value = d.getFullYear()
      viewMonth.value = d.getMonth()
    }
  },
  { immediate: true },
)

const monthLabel = computed(() => `${MONTH_NAMES[viewMonth.value]} ${viewYear.value}`)

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

/** Format a date as YYYY-MM-DD */
function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Parse YYYY-MM-DD to a plain object */
function parseIso(str: string): { year: number; month: number; day: number } | null {
  const parts = str.split('-')
  if (parts.length !== 3) return null
  return { year: Number(parts[0]), month: Number(parts[1]) - 1, day: Number(parts[2]) }
}

interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  events: PrCalendarEvent[]
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = viewYear.value
  const month = viewMonth.value

  // First day of month (0=Sunday, shift to Monday-based)
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const mondayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate())

  const eventsMap = new Map<string, PrCalendarEvent[]>()
  for (const event of props.events) {
    const existing = eventsMap.get(event.date) ?? []
    eventsMap.set(event.date, [...existing, event])
  }

  const days: CalendarDay[] = []

  // Previous month trailing days
  for (let i = mondayOffset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const iso = toIso(prevYear, prevMonth, d)
    days.push({
      date: iso,
      day: d,
      isCurrentMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === props.modelValue,
      isDisabled: isDateDisabled(iso),
      events: eventsMap.get(iso) ?? [],
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toIso(year, month, d)
    days.push({
      date: iso,
      day: d,
      isCurrentMonth: true,
      isToday: iso === todayIso,
      isSelected: iso === props.modelValue,
      isDisabled: isDateDisabled(iso),
      events: eventsMap.get(iso) ?? [],
    })
  }

  // Next month leading days (fill to 42 = 6 rows)
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const nextMo = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const iso = toIso(nextYear, nextMo, d)
    days.push({
      date: iso,
      day: d,
      isCurrentMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === props.modelValue,
      isDisabled: isDateDisabled(iso),
      events: eventsMap.get(iso) ?? [],
    })
  }

  return days
})

function isDateDisabled(iso: string): boolean {
  if (props.min && iso < props.min) return true
  if (props.max && iso > props.max) return true
  return false
}

function selectDate(day: CalendarDay) {
  if (day.isDisabled) return
  emit('update:modelValue', day.date)
  emit('select-date', day.date)
}

const eventDotColor: Record<string, string> = {
  sage: 'bg-prado-sage',
  orange: 'bg-[var(--prado-orange)]',
  teal: 'bg-[var(--prado-teal)]',
  red: 'bg-red-500',
  gray: 'bg-prado-text-muted',
}
</script>

<template>
  <div class="w-full max-w-sm">
    <!-- Header: navigation -->
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-prado-surface-hover text-prado-text-muted hover:text-prado-text transition-colors"
        aria-label="Mois precedent"
        @click="prevMonth"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
        </svg>
      </button>

      <span class="text-sm font-semibold text-prado-text">
        {{ monthLabel }}
      </span>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-prado-surface-hover text-prado-text-muted hover:text-prado-text transition-colors"
        aria-label="Mois suivant"
        @click="nextMonth"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-0 mb-1">
      <div
        v-for="wd in WEEKDAYS"
        :key="wd"
        class="text-center text-xs font-medium text-prado-text-faint py-1"
      >
        {{ wd }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-0" role="grid" :aria-label="monthLabel">
      <button
        v-for="day in calendarDays"
        :key="day.date"
        type="button"
        role="gridcell"
        :aria-selected="day.isSelected"
        :aria-disabled="day.isDisabled || undefined"
        :tabindex="day.isDisabled ? -1 : 0"
        class="relative flex flex-col items-center justify-start py-1.5 text-sm rounded-lg transition-colors"
        :class="[
          day.isDisabled && 'opacity-30 cursor-not-allowed',
          !day.isDisabled && 'cursor-pointer hover:bg-prado-surface-hover',
          !day.isCurrentMonth && 'text-prado-text-faint',
          day.isCurrentMonth && !day.isSelected && !day.isToday && 'text-prado-text',
          day.isToday && !day.isSelected && 'font-bold text-prado-sage',
          day.isSelected && 'bg-prado-sage text-white font-semibold hover:bg-prado-sage/90',
        ]"
        @click="selectDate(day)"
      >
        <span>{{ day.day }}</span>
        <!-- Event dots -->
        <div
          v-if="day.events.length > 0"
          class="flex gap-0.5 mt-0.5"
        >
          <span
            v-for="(evt, ei) in day.events.slice(0, 3)"
            :key="ei"
            class="w-1 h-1 rounded-full"
            :class="day.isSelected ? 'bg-white' : eventDotColor[evt.color ?? 'sage']"
          />
        </div>
      </button>
    </div>
  </div>
</template>
