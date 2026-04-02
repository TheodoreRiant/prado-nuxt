<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const selectedYear = ref(String(new Date().getFullYear()))

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => String(currentYear - i))
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-prado-text italic">Budget</h1>
        <p class="text-sm text-prado-text-muted">Donnees confidentielles reservees aux administrateurs</p>
      </div>
      <select
        v-model="selectedYear"
        class="px-4 py-2.5 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium"
      >
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <AdminStatsBudget :year="selectedYear" />
  </div>
</template>
