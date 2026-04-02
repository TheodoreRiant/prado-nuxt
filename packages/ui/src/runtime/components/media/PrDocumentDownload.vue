<script setup lang="ts">
interface Props {
  title: string
  description?: string
  category?: string
  fileUrl: string
  fileSize?: string
}

defineProps<Props>()
</script>

<template>
  <a
    :href="fileUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex items-start gap-4 p-5 rounded-2xl bg-prado-surface border border-prado-border hover:border-prado-border-medium hover:-translate-y-0.5 transition-all"
  >
    <!-- File icon -->
    <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
      <svg class="w-5.5 h-5.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h3 class="text-prado-text font-medium mb-1 group-hover:text-[var(--prado-signature-accent)] transition-colors">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-prado-text-muted line-clamp-2 mb-2">
        {{ description }}
      </p>
      <div class="flex items-center gap-3 text-xs text-prado-text-faint">
        <span v-if="category" class="px-2 py-0.5 rounded-full bg-prado-tag-bg">{{ category }}</span>
        <span v-if="fileSize">{{ fileSize }}</span>
        <span>PDF</span>
      </div>
    </div>

    <!-- Download icon -->
    <svg class="w-4.5 h-4.5 text-prado-text-faint group-hover:text-[var(--prado-signature-accent)] transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  </a>
</template>
