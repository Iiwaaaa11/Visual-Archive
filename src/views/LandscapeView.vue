<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AdaptiveGallery from '@/components/AdaptiveGallery.vue'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import { landscapePhotos } from '@/data/gallery'
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
    (activeIndex.value + 1) % landscapePhotos.length
}

const previousPhoto = () => {
  activeIndex.value =
    activeIndex.value === 0
      ? landscapePhotos.length - 1
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
    gsap.from('.gallery-hero__content > *', {
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
  <div ref="page" class="landscape-page">
    <AppHeader />

    <main>
      <section class="gallery-hero page-section">
        <div class="gallery-hero__background">
          <img
            :src="landscapePhotos[0].image"
            alt="Landscape cover"
          />
        </div>

        <div class="gallery-hero__overlay"></div>

        <div class="gallery-hero__content">
          <span class="section-label">
            01 / Landscape
          </span>

          <h1>Landscape</h1>

          <p>
            Nature, light, and distant places.
          </p>
        </div>
      </section>

      <section class="gallery-intro page-section">
        <p>
          A collection of mountains, quiet roads,
          changing light, and places found between journeys.
        </p>

        <div class="gallery-intro__side">
          <span>
            {{ landscapePhotos.length }} photographs
          </span>

          <button
            type="button"
            class="gallery-intro__index"
            data-cursor="Open"
            @click="openGalleryIndex"
          >
            Open Index
          </button>
        </div>
      </section>

      <AdaptiveGallery
        :photos="landscapePhotos"
        @select="openLightbox"
        @active-change="activeVisibleIndex = $event"
      />
    </main>

    <GalleryStatus
      label="Landscape"
      :current-index="activeVisibleIndex"
      :total="landscapePhotos.length"
    />

    <GalleryIndex
      title="Landscape"
      :photos="landscapePhotos"
      :is-open="isGalleryIndexOpen"
      @close="closeGalleryIndex"
      @select="selectFromIndex"
    />

    <PhotoLightbox
      :photos="landscapePhotos"
      :active-index="activeIndex"
      :is-open="isLightboxOpen"
      @close="closeLightbox"
      @next="nextPhoto"
      @previous="previousPhoto"
    />

    <AppFooter />
  </div>
</template>

<style scoped>
.landscape-page {
  min-height: 100vh;
  background: #e7e5df;
  color: #111111;
}

.gallery-hero {
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: flex-end;
  overflow: hidden;
  padding-bottom: 70px;
  color: #f2f0ea;
}

.gallery-hero__background,
.gallery-hero__overlay {
  position: absolute;
  inset: 0;
}

.gallery-hero__background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-hero__overlay {
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.76),
      transparent 58%
    ),
    rgba(0, 0, 0, 0.15);
}

.gallery-hero__content {
  position: relative;
  z-index: 2;
}

.gallery-hero__content h1 {
  margin: 22px 0 0;
  font-size: clamp(70px, 15vw, 210px);
  font-weight: 300;
  line-height: 0.82;
  letter-spacing: -0.085em;
}

.gallery-hero__content p {
  margin: 30px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  letter-spacing: 0.06em;
}

.gallery-intro {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding-top: 110px;
  padding-bottom: 140px;
}

.gallery-intro p {
  max-width: 780px;
  margin: 0;
  font-size: clamp(28px, 4vw, 58px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.045em;
}

.gallery-intro span {
  align-self: flex-end;
  color: #656565;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.gallery-intro__side {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 22px;
}

.gallery-intro__index {
  padding-bottom: 6px;
  border-bottom: 1px solid currentColor;
  color: #383838;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@media (max-width: 800px) {
  .gallery-intro__side {
    align-items: flex-start;
  }
}

@media (max-width: 800px) {
  .gallery-hero {
    min-height: 92vh;
  }

  .gallery-intro {
    flex-direction: column;
    padding-top: 80px;
    padding-bottom: 100px;
  }

  .gallery-intro span {
    align-self: flex-start;
  }
}
</style>