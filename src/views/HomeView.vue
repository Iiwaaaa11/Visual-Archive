<script setup>
import { ref } from 'vue'

import AppHeader from '@/components/AppHeader.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import CinematicIntro from '@/components/CinematicIntro.vue'
import GenreSelector from '@/components/GenreSelector.vue'
import LandscapePreview from '@/components/LandscapePreview.vue'
import ArchivePreview from '@/components/ArchivePreview.vue'
import AppFooter from '@/components/AppFooter.vue'

const INTRO_STORAGE_KEY = 'hswld:intro-seen'

const introAssets = [
  '/images/landscape/landscape-01.png',
  '/images/old-archive/archive-01.png',
]

const hasSeenIntro = sessionStorage.getItem(
  INTRO_STORAGE_KEY,
) === 'true'

const loading = ref(!hasSeenIntro)

const finishLoading = () => {
  sessionStorage.setItem(
    INTRO_STORAGE_KEY,
    'true',
  )

  loading.value = false
}
</script>

<template>
  <div class="page-shell">
    <LoadingScreen
      v-if="loading"
      :assets="introAssets"
      @complete="finishLoading"
    />

    <AppHeader />

    <main>
      <CinematicIntro />
      <GenreSelector />
      <LandscapePreview />
      <ArchivePreview />
    </main>

    <AppFooter />
  </div>
</template>