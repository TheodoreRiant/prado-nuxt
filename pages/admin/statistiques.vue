<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const selectedYear = ref(String(new Date().getFullYear()))

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => String(currentYear - i))
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-xl font-semibold text-prado-text italic">Statistiques</h1>
      <select
        v-model="selectedYear"
        class="px-4 py-2.5 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium"
      >
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdminStatsProfilsSituations :year="selectedYear" />
      <AdminStatsProvenances :year="selectedYear" />
      <AdminStatsActions :year="selectedYear" />
      <AdminStatsBudget :year="selectedYear" />
    </div>
  </div>
</template>
