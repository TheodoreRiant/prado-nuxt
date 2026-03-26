<script setup lang="ts">
const props = defineProps<{
  modelValue: string // format YYYY-MM-DD
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const maxYear = new Date().getFullYear() - 18
const minYear = 1940

const day = ref<number | ''>('')
const month = ref<number | ''>('')
const year = ref<number | ''>('')

// Parse initial value
watch(() => props.modelValue, (val) => {
  if (!val) return
  const d = new Date(val)
  if (isNaN(d.getTime())) return
  // Only set if refs are empty (avoid overwriting user input)
  if (day.value === '' && month.value === '' && year.value === '') {
    day.value = d.getDate()
    month.value = d.getMonth() + 1
    year.value = d.getFullYear()
  }
}, { immediate: true })

// Emit combined value
function emitDate() {
  if (day.value !== '' && month.value !== '' && year.value !== '') {
    const d = String(day.value).padStart(2, '0')
    const m = String(month.value).padStart(2, '0')
    emit('update:modelValue', `${year.value}-${m}-${d}`)
  }
}

watch([day, month, year], emitDate)

const months = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
]

const daysInMonth = computed(() => {
  if (month.value === '' || year.value === '') return 31
  return new Date(Number(year.value), Number(month.value), 0).getDate()
})

// Clamp day if month/year changes
watch(daysInMonth, (max) => {
  if (day.value !== '' && Number(day.value) > max) {
    day.value = max
  }
})

const years = computed(() => {
  const arr: number[] = []
  for (let y = maxYear; y >= minYear; y--) arr.push(y)
  return arr
})

const selectClass = 'px-3 py-2 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium appearance-none'
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <!-- Jour -->
    <select
      v-model.number="day"
      :class="selectClass"
      required
    >
      <option value="" disabled>Jour</option>
      <option v-for="d in daysInMonth" :key="d" :value="d">{{ d }}</option>
    </select>

    <!-- Mois -->
    <select
      v-model.number="month"
      :class="selectClass"
      required
    >
      <option value="" disabled>Mois</option>
      <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
    </select>

    <!-- Année -->
    <select
      v-model.number="year"
      :class="selectClass"
      required
    >
      <option value="" disabled>Année</option>
      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
    </select>
  </div>
</template>
