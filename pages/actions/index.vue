<script setup lang="ts">
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
import {
  PROGRAMMATION_CATEGORIES,
  PROGRAMMATION_CATEGORY_COLORS,
  RESSOURCE_CATEGORIES,
  RESSOURCE_CATEGORY_COLORS,
  type ProgrammationCategory,
  type RessourceCategory,
} from '~/constants/categories'

type Panel = 'actions' | 'ressources'
type FilterMode = 'activite' | 'actions'

const { client: prismic } = usePrismic()
const { getActionImage, getRessourceImage } = useImages()

const panel = ref<Panel>('actions')
const search = ref('')
const categoryFilter = ref<ProgrammationCategory | 'all'>('all')
const filterMode = ref<FilterMode>('activite')
const actionsPage = ref(1)
const searchRes = ref('')
const catRes = ref<RessourceCategory | 'all'>('all')
const resPage = ref(1)
const listRef = ref<HTMLDivElement | null>(null)

// Animation key to force re-render on filter/page changes
const actionsAnimKey = ref(0)
const resAnimKey = ref(0)

const ITEMS_PER_PAGE = 12
const RES_PER_PAGE = 12

const { data: prismicActions, status: actionsStatus } = await useAsyncData('actions', () =>
  prismic.getAllByType('action')
)
const { data: prismicRessources, status: ressourcesStatus } = await useAsyncData('ressources', () =>
  prismic.getAllByType('ressource')
)

const loadingData = computed(() => actionsStatus.value === 'pending' || ressourcesStatus.value === 'pending')

const programmation = computed(() =>
  (prismicActions.value ?? []).map(doc => ({
    id: doc.data.original_id as number,
    title: doc.data.title as string,
    category: doc.data.category as ProgrammationCategory,
    date: (doc.data.date_text as string) ?? '',
    time: (doc.data.time_text as string) ?? '',
    summary: (doc.data.summary as string) ?? '',
    description: doc.data.description?.[0]?.text ?? '',
    urlDetail: doc.data.url_detail?.url ?? '',
    urlImage: getActionImage(doc.data.original_id as number),
    isActivite: doc.data.is_activite ?? false,
  }))
)

const ressources = computed(() =>
  (prismicRessources.value ?? []).map(doc => ({
    id: doc.data.original_id as number,
    title: doc.data.title as string,
    category: doc.data.category as RessourceCategory,
    description: doc.data.description?.[0]?.text ?? '',
    url: doc.data.url?.url ?? '',
    image: getRessourceImage(doc.data.original_id as number),
  }))
)

const filteredActions = computed(() =>
  programmation.value.filter(a => {
    if (filterMode.value === 'activite' && !a.isActivite) return false
    if (filterMode.value === 'actions' && a.isActivite) return false
    if (categoryFilter.value !== 'all' && a.category !== categoryFilter.value) return false
    if (search.value && !a.title.toLowerCase().includes(search.value.toLowerCase()) && !a.description.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
)

const actionsTotalPages = computed(() => Math.ceil(filteredActions.value.length / ITEMS_PER_PAGE))
const paginatedActions = computed(() =>
  filteredActions.value.slice((actionsPage.value - 1) * ITEMS_PER_PAGE, actionsPage.value * ITEMS_PER_PAGE)
)

const filteredRes = computed(() =>
  ressources.value.filter(r => {
    if (catRes.value !== 'all' && r.category !== catRes.value) return false
    if (searchRes.value && !r.title.toLowerCase().includes(searchRes.value.toLowerCase()) && !r.description.toLowerCase().includes(searchRes.value.toLowerCase())) return false
    return true
  })
)

const resTotalPages = computed(() => Math.ceil(filteredRes.value.length / RES_PER_PAGE))
const paginatedRes = computed(() =>
  filteredRes.value.slice((resPage.value - 1) * RES_PER_PAGE, resPage.value * RES_PER_PAGE)
)

const visibleCategories = computed(() =>
  PROGRAMMATION_CATEGORIES.filter(cat =>
    programmation.value.some(a => {
      if (filterMode.value === 'activite' && !a.isActivite) return false
      if (filterMode.value === 'actions' && a.isActivite) return false
      return a.category === cat
    })
  )
)

function scrollToList() {
  listRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function switchPanel(p: Panel) {
  panel.value = p
  scrollToList()
}

function onSearchActions(val: string) {
  search.value = val
  actionsPage.value = 1
  actionsAnimKey.value++
}

function onSearchRes(val: string) {
  searchRes.value = val
  resPage.value = 1
  resAnimKey.value++
}

function toggleCategory(cat: ProgrammationCategory) {
  categoryFilter.value = categoryFilter.value === cat ? 'all' : cat
  actionsPage.value = 1
  actionsAnimKey.value++
}

function toggleCatRes(cat: RessourceCategory) {
  catRes.value = catRes.value === cat ? 'all' : cat
  resPage.value = 1
  resAnimKey.value++
}

function setFilterModeAndReset(mode: FilterMode) {
  filterMode.value = mode
  categoryFilter.value = 'all'
  actionsPage.value = 1
  actionsAnimKey.value++
}

function goToPage(page: number, setter: (p: number) => void) {
  setter(page)
  actionsAnimKey.value++
  resAnimKey.value++
  scrollToList()
}

function paginationPages(currentPage: number, totalPages: number): (number | string)[] {
  return Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
    .reduce<(number | string)[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
      acc.push(p)
      return acc
    }, [])
}

// Staggered card animation via IntersectionObserver
function onCardEnter(el: Element, index: number) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'translateY(24px)'
  requestAnimationFrame(() => {
    setTimeout(() => {
      htmlEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
      htmlEl.style.opacity = '1'
      htmlEl.style.transform = 'translateY(0)'
    }, index * 60)
  })
}
</script>

<template>
  <div>
    <!-- Hero with staggered fade-in -->
    <div class="py-20 md:py-28">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <p class="text-prado-text-muted text-sm mb-5 tracking-wide anim-stagger" style="--delay: 0">
          Programmation 2025-2026 | 11-25 ans
        </p>
        <h1
          class="text-4xl md:text-5xl lg:text-6xl text-prado-text mb-6 anim-stagger"
          style="--delay: 1"
          :style="{ fontFamily: 'Poppins', lineHeight: 1.15 }"
        >
          Jeunes &amp; Autonomes
        </h1>
        <p class="text-prado-text-muted max-w-2xl mx-auto mb-10 leading-relaxed anim-stagger" style="--delay: 2">
          Des actions socio-educatives pour accompagner les jeunes vers l'autonomie : activites au calendrier, actions sur mesure et ressources pour les professionnels.
        </p>
        <button
          class="px-8 py-3.5 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors anim-stagger"
          style="--delay: 3"
          @click="scrollToList"
        >
          Parcourir la programmation
        </button>
      </div>
    </div>

    <div class="h-px bg-prado-border-light" />

    <!-- Content -->
    <div ref="listRef" class="bg-prado-bg-deep min-h-screen">
      <div v-if="loadingData" class="flex items-center justify-center py-20">
        <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
      </div>
      <div v-else class="max-w-7xl mx-auto px-6 py-14">
        <!-- Tabs -->
        <div class="flex border-b border-prado-border-light w-full mb-8 anim-stagger" style="--delay: 4">
          <button
            :class="[
              'px-6 py-3 text-sm transition-colors relative',
              panel === 'actions' ? 'text-prado-text' : 'text-prado-text-muted hover:text-prado-text-secondary',
            ]"
            @click="switchPanel('actions')"
          >
            Actions
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CF006C] transition-all duration-300"
              :class="panel === 'actions' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
            />
          </button>
          <button
            :class="[
              'px-6 py-3 text-sm transition-colors relative',
              panel === 'ressources' ? 'text-prado-text' : 'text-prado-text-muted hover:text-prado-text-secondary',
            ]"
            @click="switchPanel('ressources')"
          >
            Ressources
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CF006C] transition-all duration-300"
              :class="panel === 'ressources' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
            />
          </button>
        </div>

        <!-- Panel transitions -->
        <Transition name="panel" mode="out-in">
          <!-- ACTIONS PANEL -->
          <div v-if="panel === 'actions'" key="actions">
            <h2 class="text-3xl md:text-4xl text-prado-text mb-6" :style="{ fontFamily: 'Poppins' }">
              Notre programmation
            </h2>

            <div class="relative mb-8">
              <Search :size="20" class="absolute left-6 top-1/2 -translate-y-1/2 text-prado-text-faint" />
              <input
                :value="search"
                placeholder="Rechercher une action..."
                class="w-full pl-14 pr-6 py-5 rounded-2xl bg-prado-surface border border-prado-border-light text-prado-text text-base placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium shadow-lg"
                @input="onSearchActions(($event.target as HTMLInputElement).value)"
              />
            </div>

            <div class="flex flex-wrap gap-3 mb-8 items-center">
              <button
                class="relative flex items-center w-[200px] h-10 rounded-full bg-prado-surface border border-prado-border-light cursor-pointer p-1"
                @click="setFilterModeAndReset(filterMode === 'activite' ? 'actions' : 'activite')"
              >
                <span
                  class="absolute h-8 rounded-full bg-[#CF006C] transition-all duration-300 ease-in-out"
                  :style="{
                    width: '96px',
                    left: filterMode === 'activite' ? '4px' : '100px',
                  }"
                />
                <span
                  :class="[
                    'relative z-10 flex-1 text-center text-sm transition-colors duration-200',
                    filterMode === 'activite' ? 'text-white' : 'text-prado-text-muted',
                  ]"
                >
                  Activite
                </span>
                <span
                  :class="[
                    'relative z-10 flex-1 text-center text-sm transition-colors duration-200',
                    filterMode === 'actions' ? 'text-white' : 'text-prado-text-muted',
                  ]"
                >
                  Actions
                </span>
              </button>

              <TransitionGroup name="chip" tag="div" class="flex flex-wrap gap-2">
                <button
                  v-for="cat in visibleCategories"
                  :key="cat"
                  :class="[
                    'px-4 py-2 rounded-full text-sm transition-all duration-200 border flex items-center gap-2',
                    categoryFilter === cat
                      ? 'text-prado-text border-prado-border-medium'
                      : 'text-prado-text-muted border-prado-border hover:text-prado-text-secondary hover:border-prado-border-light',
                  ]"
                  :style="categoryFilter === cat ? { backgroundColor: PROGRAMMATION_CATEGORY_COLORS[cat] + '30', borderColor: PROGRAMMATION_CATEGORY_COLORS[cat] + '50' } : {}"
                  @click="toggleCategory(cat)"
                >
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: PROGRAMMATION_CATEGORY_COLORS[cat] }" />
                  {{ cat }}
                </button>
              </TransitionGroup>

              <span class="text-sm text-prado-text-faint ml-2">{{ filteredActions.length }} action{{ filteredActions.length > 1 ? 's' : '' }}</span>
            </div>

            <!-- Cards grid with staggered animation -->
            <Transition name="grid-fade" mode="out-in">
              <div v-if="paginatedActions.length > 0" :key="actionsAnimKey" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink
                  v-for="(a, i) in paginatedActions"
                  :key="a.id"
                  :ref="(el: any) => { if (el?.$el) onCardEnter(el.$el, i) }"
                  :to="`/actions/${a.id}`"
                  class="group block rounded-2xl overflow-hidden bg-prado-surface hover:brightness-105 transition-all duration-300"
                >
                  <div class="relative h-48 overflow-hidden bg-prado-surface">
                    <ImageWithFallback :src="a.urlImage" :alt="a.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-prado-surface/60 to-transparent" />

                    <div
                      v-if="a.isActivite"
                      class="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs text-white"
                      :style="{ backgroundColor: PROGRAMMATION_CATEGORY_COLORS[a.category] }"
                    >
                      {{ a.date }}
                    </div>
                    <div
                      v-else
                      class="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs bg-prado-tag-bg backdrop-blur-sm text-prado-text"
                    >
                      Toute l'annee
                    </div>
                  </div>

                  <div class="p-5">
                    <span class="text-xs mb-2 inline-block" :style="{ color: PROGRAMMATION_CATEGORY_COLORS[a.category] }">{{ a.category }}</span>
                    <h3 class="text-prado-text mb-2 line-clamp-2 group-hover:text-[#93C1AF] transition-colors">{{ a.title }}</h3>
                    <p class="text-sm text-prado-text-muted line-clamp-2 mb-3">{{ a.summary }}</p>
                    <div v-if="a.time" class="text-xs text-prado-text-faint">{{ a.time }}</div>
                  </div>
                </NuxtLink>
              </div>
              <div v-else :key="'empty-actions'" class="text-center py-20 text-prado-text-faint anim-fade-in">
                <p>Aucune action ne correspond a vos criteres.</p>
              </div>
            </Transition>

            <!-- Pagination -->
            <div v-if="actionsTotalPages > 1" class="flex items-center justify-center gap-2 mt-12">
              <button
                :disabled="actionsPage === 1"
                class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                @click="goToPage(actionsPage - 1, (p) => actionsPage = p)"
              >
                <ChevronLeft :size="20" />
              </button>
              <template v-for="(p, i) in paginationPages(actionsPage, actionsTotalPages)" :key="i">
                <span v-if="typeof p === 'string'" class="text-prado-text-faint px-1">...</span>
                <button
                  v-else
                  :class="[
                    'w-10 h-10 rounded-full text-sm transition-colors',
                    actionsPage === p ? 'bg-prado-tag-bg text-prado-text' : 'text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover',
                  ]"
                  @click="goToPage(p as number, (v) => actionsPage = v)"
                >
                  {{ p }}
                </button>
              </template>
              <button
                :disabled="actionsPage === actionsTotalPages"
                class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                @click="goToPage(actionsPage + 1, (p) => actionsPage = p)"
              >
                <ChevronRight :size="20" />
              </button>
            </div>
          </div>

          <!-- RESSOURCES PANEL -->
          <div v-else key="ressources">
            <h2 class="text-3xl md:text-4xl text-prado-text mb-6" :style="{ fontFamily: 'Poppins' }">
              Ressources pour les referents
            </h2>

            <div class="relative mb-8">
              <Search :size="20" class="absolute left-6 top-1/2 -translate-y-1/2 text-prado-text-faint" />
              <input
                :value="searchRes"
                placeholder="Rechercher une ressource..."
                class="w-full pl-14 pr-6 py-5 rounded-2xl bg-prado-surface border border-prado-border-light text-prado-text text-base placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium shadow-lg"
                @input="onSearchRes(($event.target as HTMLInputElement).value)"
              />
            </div>

            <div class="flex flex-wrap gap-2 mb-8 items-center">
              <TransitionGroup name="chip" tag="div" class="flex flex-wrap gap-2">
                <button
                  v-for="c in RESSOURCE_CATEGORIES"
                  :key="c"
                  :class="[
                    'px-4 py-2 rounded-full text-sm transition-all duration-200 border flex items-center gap-2',
                    catRes === c
                      ? 'text-prado-text border-prado-border-medium'
                      : 'text-prado-text-muted border-prado-border hover:text-prado-text-secondary hover:border-prado-border-light',
                  ]"
                  :style="catRes === c ? { backgroundColor: RESSOURCE_CATEGORY_COLORS[c] + '30', borderColor: RESSOURCE_CATEGORY_COLORS[c] + '50' } : {}"
                  @click="toggleCatRes(c)"
                >
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: RESSOURCE_CATEGORY_COLORS[c] }" />
                  {{ c }}
                </button>
              </TransitionGroup>
              <span class="text-sm text-prado-text-faint ml-2">{{ filteredRes.length }} ressource{{ filteredRes.length > 1 ? 's' : '' }}</span>
            </div>

            <!-- Cards grid with staggered animation -->
            <Transition name="grid-fade" mode="out-in">
              <div v-if="paginatedRes.length > 0" :key="resAnimKey" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink
                  v-for="(r, i) in paginatedRes"
                  :key="r.id"
                  :ref="(el: any) => { if (el?.$el) onCardEnter(el.$el, i) }"
                  :to="`/ressources/${r.id}`"
                  class="group block rounded-2xl overflow-hidden bg-prado-surface hover:brightness-105 transition-all duration-300"
                >
                  <div class="relative h-44 overflow-hidden bg-prado-surface">
                    <ImageWithFallback :src="r.image" :alt="r.title" class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div class="p-5">
                    <span class="text-xs mb-2 inline-block" :style="{ color: RESSOURCE_CATEGORY_COLORS[r.category] }">{{ r.category }}</span>
                    <h3 class="text-prado-text mb-2 line-clamp-2 group-hover:text-[#93C1AF] transition-colors">{{ r.title }}</h3>
                    <p class="text-sm text-prado-text-muted line-clamp-2">{{ r.description }}</p>
                  </div>
                </NuxtLink>
              </div>
              <div v-else :key="'empty-res'" class="text-center py-20 text-prado-text-faint anim-fade-in">
                <p>Aucune ressource ne correspond a vos criteres.</p>
              </div>
            </Transition>

            <!-- Pagination -->
            <div v-if="resTotalPages > 1" class="flex items-center justify-center gap-2 mt-12">
              <button
                :disabled="resPage === 1"
                class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                @click="goToPage(resPage - 1, (p) => resPage = p)"
              >
                <ChevronLeft :size="20" />
              </button>
              <template v-for="(p, i) in paginationPages(resPage, resTotalPages)" :key="i">
                <span v-if="typeof p === 'string'" class="text-prado-text-faint px-1">...</span>
                <button
                  v-else
                  :class="[
                    'w-10 h-10 rounded-full text-sm transition-colors',
                    resPage === p ? 'bg-prado-tag-bg text-prado-text' : 'text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover',
                  ]"
                  @click="goToPage(p as number, (v) => resPage = v)"
                >
                  {{ p }}
                </button>
              </template>
              <button
                :disabled="resPage === resTotalPages"
                class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                @click="goToPage(resPage + 1, (p) => resPage = p)"
              >
                <ChevronRight :size="20" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Staggered entrance */
.anim-stagger {
  animation: fadeInUp 0.5s ease both;
  animation-delay: calc(var(--delay, 0) * 80ms);
}

.anim-fade-in {
  animation: fadeIn 0.4s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Panel switch transition */
.panel-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.panel-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Grid fade on filter/page change */
.grid-fade-enter-active {
  transition: opacity 0.3s ease;
}
.grid-fade-leave-active {
  transition: opacity 0.15s ease;
}
.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
}

/* Category chip transitions */
.chip-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.chip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.chip-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.chip-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.chip-move {
  transition: transform 0.25s ease;
}
</style>
