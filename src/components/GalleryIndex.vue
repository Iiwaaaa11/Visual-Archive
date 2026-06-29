<script setup>
import {
  onMounted,
  onUnmounted,
} from 'vue'

import SmartImage from '@/components/SmartImage.vue'

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },

  isOpen: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    required: true,
  },

  archiveMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'close',
  'select',
])

const handleKeydown = (event) => {
  if (!props.isOpen) {
    return
  }

  if (event.key === 'Escape') {
    emit('close')
  }
}

const selectPhoto = (index) => {
  emit('select', index)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="gallery-index">
    <div
      v-if="isOpen"
      class="gallery-index"
      :class="{
        'gallery-index--archive': archiveMode,
      }"
    >
      <header class="gallery-index__header">
        <div>
          <span class="gallery-index__subtitle">
            HSWLD
          </span>

          <h2>{{ title }}</h2>
        </div>

        <div class="gallery-index__header-right">
          <span>
            {{ String(photos.length).padStart(2, '0') }}
            photographs
          </span>

          <button
            type="button"
            data-cursor="Close"
            @click="emit('close')"
          >
            Close
          </button>
        </div>
      </header>

      <div class="gallery-index__content">
        <button
          v-for="(photo, index) in photos"
          :key="photo.id"
          class="gallery-index__item"
          type="button"
          data-cursor="View"
          @click="selectPhoto(index)"
        >
          <div class="gallery-index__image">
            <SmartImage
              :src="photo.image"
              :alt="photo.title"
              :archive-mode="archiveMode"
            />
          </div>

          <div class="gallery-index__meta">
            <span>
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <div>
              <h3>{{ photo.title }}</h3>
              <p>{{ photo.year }}</p>
            </div>
          </div>
        </button>
      </div>

      <footer class="gallery-index__footer">
        <span>{{ title }}</span>
        <span>Visual Archive</span>
      </footer>
    </div>
  </Transition>
</template>

<style scoped>
.gallery-index {
  position: fixed;
  inset: 0;
  z-index: 9500;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: #e7e5df;
  color: #111111;
}

.gallery-index--archive {
  background: #0b0b0b;
  color: #f2f0ea;
}

.gallery-index--archive::before {
  position: fixed;
  inset: 0;
  z-index: 0;
  content: '';
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.22'/%3E%3C/svg%3E");
  opacity: 0.08;
  pointer-events: none;
}

.gallery-index__header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  padding:
    38px
    var(--page-padding)
    30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
}

.gallery-index--archive
  .gallery-index__header {
  border-color: rgba(255, 255, 255, 0.16);
}

.gallery-index__subtitle {
  display: block;
  margin-bottom: 9px;
  color: #686868;
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.gallery-index__header h2 {
  margin: 0;
  font-size: clamp(35px, 5vw, 72px);
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.gallery-index__header-right {
  display: flex;
  align-items: center;
  gap: 35px;
  color: #686868;
  font-size: 9px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.gallery-index__header-right button {
  padding-bottom: 5px;
  border-bottom: 1px solid currentColor;
}

.gallery-index__content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 70px 20px;
  padding:
    60px
    var(--page-padding)
    130px;
}

.gallery-index__item {
  min-width: 0;
  padding: 0;
  color: inherit;
  text-align: left;
}

.gallery-index__image {
  width: 100%;
  overflow: hidden;
  background: rgba(100, 100, 100, 0.14);
}

.gallery-index__image
  :deep(.smart-image) {
  height: 320px;
}

.gallery-index__image
  :deep(.smart-image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    opacity 500ms ease,
    transform 700ms
      cubic-bezier(0.2, 0.7, 0, 1);
}

.gallery-index--archive
  .gallery-index__image img {
  filter: grayscale(1) contrast(1.12);
}

.gallery-index__item:hover
  .gallery-index__image
  :deep(.smart-image img) {
  transform: scale(1.045);
}

.gallery-index__meta {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
  margin-top: 12px;
}

.gallery-index__meta > span {
  color: #777777;
  font-size: 8px;
}

.gallery-index__meta h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}

.gallery-index__meta p {
  margin: 4px 0 0;
  color: #777777;
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.gallery-index__footer {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  padding:
    25px
    var(--page-padding);
  border-top: 1px solid rgba(0, 0, 0, 0.18);
  color: #777777;
  font-size: 8px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.gallery-index--archive
  .gallery-index__footer {
  border-color: rgba(255, 255, 255, 0.16);
}

.gallery-index-enter-active,
.gallery-index-leave-active {
  transition:
    opacity 450ms ease,
    transform 650ms cubic-bezier(0.2, 0.7, 0, 1);
}

.gallery-index-enter-from,
.gallery-index-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

@media (max-width: 1100px) {
  .gallery-index__content {
    grid-template-columns: repeat(3, 1fr);
  }

  .gallery-index__image
    :deep(.smart-image) {
    height: 300px;
  }
}

@media (max-width: 760px) {
  .gallery-index__header {
    align-items: flex-start;
    flex-direction: column;
    padding-top: 90px;
  }

  .gallery-index__header-right {
    width: 100%;
    justify-content: space-between;
  }

  .gallery-index__content {
    grid-template-columns: repeat(2, 1fr);
    gap: 50px 14px;
    padding-top: 40px;
  }

  .gallery-index__image
    :deep(.smart-image) {
    height: 240px;
  }
}

@media (max-width: 480px) {
    .gallery-index__image
    :deep(.smart-image) {
    height: auto;
  }

  .gallery-index__image
    :deep(.smart-image img) {
    height: auto;
    max-height: 70vh;
    object-fit: contain;
  }
}
</style>