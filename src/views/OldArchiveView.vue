<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AdaptiveGallery from '@/components/AdaptiveGallery.vue'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import { oldArchivePhotos } from '@/data/gallery'
import GalleryStatus from '@/components/GalleryStatus.vue'
import GalleryIndex from '@/components/GalleryIndex.vue'

const page = ref(null)
const isLightboxOpen = ref(false)
const activeIndex = ref(0)
const activeVisibleIndex = ref(0)
const isGalleryIndexOpen = ref(false)

let context = null

const openLightbox = (index) => {
  activeIndex.value = index
  isLightboxOpen.value = true
  document.body.classList.add('no-scroll')
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.classList.remove('no-scroll')
}

const nextPhoto = () => {
  activeIndex.value =
    (activeIndex.value + 1) % oldArchivePhotos.length
}

const previousPhoto = () => {
  activeIndex.value =
    activeIndex.value === 0
      ? oldArchivePhotos.length - 1
      : activeIndex.value - 1
}

const openGalleryIndex = () => {
  isGalleryIndexOpen.value = true
  document.body.classList.add('no-scroll')
}

const closeGalleryIndex = () => {
  isGalleryIndexOpen.value = false
  document.body.classList.remove('no-scroll')
}

const selectFromIndex = (index) => {
  isGalleryIndexOpen.value = false
  activeIndex.value = index
  isLightboxOpen.value = true
}

onMounted(() => {
  context = gsap.context(() => {
    gsap.from('.archive-hero__content > *', {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 1.1,
      ease: 'power3.out',
    })
  }, page.value)
})

onUnmounted(() => {
  if (context) {
    context.revert()
  }

  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <div ref="page" class="archive-page">
    <div class="archive-page__grain"></div>
    <div class="archive-page__dust"></div>

    <AppHeader />

    <main>
      <section class="archive-hero page-section">
        <div class="archive-hero__background">
          <img
            :src="oldArchivePhotos[0].image"
            alt="Old Archive cover"
          />
        </div>

        <div class="archive-hero__overlay"></div>

        <div class="archive-hero__content">
          <span class="section-label">
            02 / Old Archive
          </span>

          <h1>Old Archive</h1>

          <p>
            Fragments of time, preserved in monochrome.
          </p>
        </div>
      </section>

      <section class="archive-intro page-section">
        <p>
          Monochrome photographs, worn textures,
          dust marks, and imperfect memories.
        </p>

        <div class="archive-intro__side">
          <span>
            {{ oldArchivePhotos.length }} photographs
          </span>

          <button
            type="button"
            class="archive-intro__index"
            data-cursor="Open"
            @click="openGalleryIndex"
          >
            Open Index
          </button>
        </div>
      </section>

      <AdaptiveGallery
        :photos="oldArchivePhotos"
        archive-mode
        @select="openLightbox"
        @active-change="activeVisibleIndex = $event"
      />
    </main>

    <GalleryStatus
      label="Old Archive"
      :current-index="activeVisibleIndex"
      :total="oldArchivePhotos.length"
      archive-mode
    />

    <GalleryIndex
      title="Old Archive"
      :photos="oldArchivePhotos"
      :is-open="isGalleryIndexOpen"
      archive-mode
      @close="closeGalleryIndex"
      @select="selectFromIndex"
    />

    <PhotoLightbox
      :photos="oldArchivePhotos"
      :active-index="activeIndex"
      :is-open="isLightboxOpen"
      archive-mode
      @close="closeLightbox"
      @next="nextPhoto"
      @previous="previousPhoto"
    />

    <AppFooter />
  </div>
</template>

<style scoped>
.archive-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #0b0b0b;
  color: #f2f0ea;
}

.archive-page__grain,
.archive-page__dust {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.archive-page__grain {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.28'/%3E%3C/svg%3E");
  opacity: 0.08;
  animation: archive-noise 0.35s steps(2) infinite;
}

.archive-page__dust {
  background:
    radial-gradient(
      circle at 18% 22%,
      rgba(255, 255, 255, 0.5) 0 1px,
      transparent 1.5px
    ),
    radial-gradient(
      circle at 72% 30%,
      rgba(255, 255, 255, 0.35) 0 1px,
      transparent 1.5px
    ),
    radial-gradient(
      circle at 42% 76%,
      rgba(255, 255, 255, 0.42) 0 1px,
      transparent 1.5px
    ),
    radial-gradient(
      circle at 86% 68%,
      rgba(255, 255, 255, 0.3) 0 1px,
      transparent 1.5px
    );
  opacity: 0.14;
}

.archive-hero {
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: flex-end;
  overflow: hidden;
  padding-bottom: 70px;
}

.archive-hero__background,
.archive-hero__overlay {
  position: absolute;
  inset: 0;
}

.archive-hero__background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.16) brightness(0.72);
}

.archive-hero__overlay {
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.82),
      transparent 58%
    ),
    rgba(0, 0, 0, 0.23);
}

.archive-hero__content {
  position: relative;
  z-index: 2;
}

.archive-hero__content h1 {
  margin: 22px 0 0;
  font-size: clamp(58px, 13vw, 190px);
  font-weight: 300;
  line-height: 0.86;
  letter-spacing: -0.08em;
}

.archive-hero__content p {
  margin: 30px 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
  letter-spacing: 0.06em;
}

.archive-intro {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding-top: 110px;
  padding-bottom: 140px;
}

.archive-intro p {
  max-width: 760px;
  margin: 0;
  font-size: clamp(28px, 4vw, 58px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.045em;
}

.archive-intro span {
  align-self: flex-end;
  color: #858585;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.archive-intro__side {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 22px;
}

.archive-intro__index {
  padding-bottom: 6px;
  border-bottom: 1px solid currentColor;
  color: #d2d2d2;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@media (max-width: 800px) {
  .archive-intro__side {
    align-items: flex-start;
  }
}

@keyframes archive-noise {
  0% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(2%, -1%);
  }

  50% {
    transform: translate(-2%, 2%);
  }

  75% {
    transform: translate(1%, 1%);
  }

  100% {
    transform: translate(-1%, -2%);
  }
}

@media (max-width: 800px) {
  .archive-hero {
    min-height: 92vh;
  }

  .archive-intro {
    flex-direction: column;
    padding-top: 80px;
    padding-bottom: 100px;
  }

  .archive-intro span {
    align-self: flex-start;
  }
}
</style>