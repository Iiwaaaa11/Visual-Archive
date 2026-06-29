<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },

  activeIndex: {
    type: Number,
    required: true,
  },

  isOpen: {
    type: Boolean,
    required: true,
  },

  archiveMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'close',
  'next',
  'previous',
])

const direction = ref('next')
const captionVisible = ref(true)

const touchStartX = ref(0)
const touchStartY = ref(0)
const touchCurrentX = ref(0)

const activePhoto = computed(() => {
  return props.photos[props.activeIndex] || null
})

const formattedCurrent = computed(() => {
  return String(props.activeIndex + 1).padStart(2, '0')
})

const formattedTotal = computed(() => {
  return String(props.photos.length).padStart(2, '0')
})

const transitionName = computed(() => {
  return direction.value === 'next'
    ? 'photo-next'
    : 'photo-previous'
})

const nextPhoto = () => {
  direction.value = 'next'
  emit('next')
}

const previousPhoto = () => {
  direction.value = 'previous'
  emit('previous')
}

const closeLightbox = () => {
  emit('close')
}

const toggleCaption = () => {
  captionVisible.value = !captionVisible.value
}

const handleKeydown = (event) => {
  if (!props.isOpen) {
    return
  }

  if (event.key === 'Escape') {
    closeLightbox()
  }

  if (event.key === 'ArrowRight') {
    nextPhoto()
  }

  if (event.key === 'ArrowLeft') {
    previousPhoto()
  }

  if (
    event.key.toLowerCase() === 'i'
  ) {
    toggleCaption()
  }
}

const handleTouchStart = (event) => {
  const touch = event.touches[0]

  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  touchCurrentX.value = touch.clientX
}

const handleTouchMove = (event) => {
  const touch = event.touches[0]

  touchCurrentX.value = touch.clientX
}

const handleTouchEnd = (event) => {
  const touch = event.changedTouches[0]

  const distanceX =
    touch.clientX - touchStartX.value

  const distanceY =
    touch.clientY - touchStartY.value

  const minimumDistance = 55

  const horizontalSwipe =
    Math.abs(distanceX) >
    Math.abs(distanceY)

  if (!horizontalSwipe) {
    return
  }

  if (Math.abs(distanceX) < minimumDistance) {
    return
  }

  if (distanceX < 0) {
    nextPhoto()
  } else {
    previousPhoto()
  }
}

const preloadImage = (index) => {
  const photo = props.photos[index]

  if (!photo?.image) {
    return
  }

  const image = new Image()
  image.src = photo.image
}

const preloadNearbyPhotos = () => {
  if (!props.photos.length) {
    return
  }

  const nextIndex =
    (props.activeIndex + 1) %
    props.photos.length

  const previousIndex =
    props.activeIndex === 0
      ? props.photos.length - 1
      : props.activeIndex - 1

  preloadImage(nextIndex)
  preloadImage(previousIndex)
}

watch(
  () => props.activeIndex,
  () => {
    preloadNearbyPhotos()
  },
)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      preloadNearbyPhotos()
      captionVisible.value = true
    }
  },
)

onMounted(() => {
  window.addEventListener(
    'keydown',
    handleKeydown,
  )
})

onUnmounted(() => {
  window.removeEventListener(
    'keydown',
    handleKeydown,
  )
})
</script>

<template>
  <Transition name="lightbox">
    <div
      v-if="isOpen && activePhoto"
      class="lightbox"
      :class="{
        'lightbox--archive': archiveMode,
        'lightbox--caption-hidden':
          !captionVisible,
      }"
      role="dialog"
      aria-modal="true"
      :aria-label="activePhoto.title"
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      @touchend.passive="handleTouchEnd"
    >
      <div
        class="lightbox__backdrop"
        @click="closeLightbox"
      ></div>

      <header class="lightbox__header">
        <div class="lightbox__brand">
          <span>HSWLD</span>
          <small>Visual Archive</small>
        </div>

        <div class="lightbox__header-actions">
          <button
            type="button"
            data-cursor="Info"
            @click="toggleCaption"
          >
            {{ captionVisible ? 'Hide Info' : 'Show Info' }}
          </button>

          <button
            type="button"
            data-cursor="Close"
            @click="closeLightbox"
          >
            Close
          </button>
        </div>
      </header>

      <button
        class="lightbox__navigation-area lightbox__navigation-area--previous"
        type="button"
        data-cursor="Previous"
        aria-label="Previous photo"
        @click="previousPhoto"
      ></button>

      <button
        class="lightbox__navigation-area lightbox__navigation-area--next"
        type="button"
        data-cursor="Next"
        aria-label="Next photo"
        @click="nextPhoto"
      ></button>

      <div class="lightbox__stage">
        <Transition
          :name="transitionName"
          mode="out-in"
        >
          <figure
            :key="activePhoto.id"
            class="lightbox__figure"
          >
            <div class="lightbox__image-wrapper">
              <img
                :src="activePhoto.image"
                :alt="activePhoto.title"
                draggable="false"
              />
            </div>

            <Transition name="caption">
              <figcaption
                v-if="captionVisible"
                class="lightbox__caption"
              >
                <span class="lightbox__number">
                  {{ formattedCurrent }}
                </span>

                <div class="lightbox__details">
                  <h2>
                    {{ activePhoto.title }}
                  </h2>

                  <p>
                    {{ activePhoto.location }}
                    <span>/</span>
                    {{ activePhoto.year }}
                  </p>
                </div>

                <span class="lightbox__total">
                  {{ formattedCurrent }}
                  /
                  {{ formattedTotal }}
                </span>
              </figcaption>
            </Transition>
          </figure>
        </Transition>
      </div>

      <div class="lightbox__mobile-navigation">
        <button
          type="button"
          @click="previousPhoto"
        >
          Previous
        </button>

        <span>
          {{ formattedCurrent }}
          /
          {{ formattedTotal }}
        </span>

        <button
          type="button"
          @click="nextPhoto"
        >
          Next
        </button>
      </div>

      <div class="lightbox__desktop-hint">
        <span>←</span>
        <span>Use arrow keys</span>
        <span>→</span>
      </div>

      <div
        v-if="archiveMode"
        class="lightbox__grain"
      ></div>

      <div
        v-if="archiveMode"
        class="lightbox__dust"
      ></div>
    </div>
  </Transition>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9998;
  overflow: hidden;
  background: #050505;
  color: #f2f0ea;
}

.lightbox__backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.lightbox__header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  padding:
    24px
    var(--page-padding);
  pointer-events: none;
}

.lightbox__brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lightbox__brand span {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.03em;
}

.lightbox__brand small {
  color: #777777;
  font-size: 7px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.lightbox__header-actions {
  display: flex;
  align-items: center;
  gap: 25px;
  pointer-events: auto;
}

.lightbox__header-actions button {
  color: #cfcfcf;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.lightbox__stage {
  position: relative;
  z-index: 4;
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  padding:
    75px
    100px
    80px;
  pointer-events: none;
}

.lightbox__figure {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  pointer-events: none;
}

.lightbox__image-wrapper {
  display: grid;
  width: 100%;
  min-height: 0;
  flex: 1;
  place-items: center;
}

.lightbox__image-wrapper img {
  display: block;
  width: auto;
  max-width: min(82vw, 1400px);
  height: auto;
  max-height: calc(100vh - 190px);
  object-fit: contain;
  user-select: none;
}

.lightbox--archive
  .lightbox__image-wrapper img {
  filter:
    grayscale(1)
    contrast(1.12);
}

.lightbox__caption {
  display: grid;
  width: min(82vw, 1400px);
  grid-template-columns:
    40px
    minmax(0, 1fr)
    auto;
  gap: 18px;
  margin-top: 18px;
  pointer-events: auto;
}

.lightbox__number,
.lightbox__total {
  color: #777777;
  font-size: 8px;
  letter-spacing: 0.12em;
}

.lightbox__total {
  align-self: end;
}

.lightbox__details h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.015em;
}

.lightbox__details p {
  margin: 6px 0 0;
  color: #777777;
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lightbox__details p span {
  margin-inline: 6px;
}

.lightbox__navigation-area {
  position: absolute;
  top: 70px;
  bottom: 70px;
  z-index: 10;
  width: 23%;
}

.lightbox__navigation-area--previous {
  left: 0;
}

.lightbox__navigation-area--next {
  right: 0;
}

.lightbox__desktop-hint {
  position: absolute;
  bottom: 23px;
  left: 50%;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #585858;
  font-size: 7px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: translateX(-50%);
}

.lightbox__mobile-navigation {
  display: none;
}

.lightbox__grain,
.lightbox__dust {
  position: absolute;
  inset: 0;
  z-index: 30;
  pointer-events: none;
}

.lightbox__grain {
  inset: -50%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.3'/%3E%3C/svg%3E");
  opacity: 0.09;
  animation:
    lightbox-grain
    0.3s
    steps(2)
    infinite;
}

.lightbox__dust {
  background:
    radial-gradient(
      circle at 16% 23%,
      rgba(255, 255, 255, 0.6)
      0 1px,
      transparent 1.5px
    ),
    radial-gradient(
      circle at 74% 31%,
      rgba(255, 255, 255, 0.4)
      0 1px,
      transparent 1.5px
    ),
    radial-gradient(
      circle at 41% 72%,
      rgba(255, 255, 255, 0.5)
      0 1px,
      transparent 1.5px
    ),
    radial-gradient(
      circle at 88% 66%,
      rgba(255, 255, 255, 0.35)
      0 1px,
      transparent 1.5px
    );
  opacity: 0.14;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition:
    opacity
    400ms
    ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.photo-next-enter-active,
.photo-next-leave-active,
.photo-previous-enter-active,
.photo-previous-leave-active {
  transition:
    opacity
    400ms
    ease,
    transform
    550ms
    cubic-bezier(0.2, 0.7, 0, 1);
}

.photo-next-enter-from {
  opacity: 0;
  transform: translateX(45px);
}

.photo-next-leave-to {
  opacity: 0;
  transform: translateX(-45px);
}

.photo-previous-enter-from {
  opacity: 0;
  transform: translateX(-45px);
}

.photo-previous-leave-to {
  opacity: 0;
  transform: translateX(45px);
}

.caption-enter-active,
.caption-leave-active {
  transition:
    opacity
    300ms
    ease,
    transform
    350ms
    ease;
}

.caption-enter-from,
.caption-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes lightbox-grain {
  0% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(2%, -3%);
  }

  50% {
    transform: translate(-3%, 1%);
  }

  75% {
    transform: translate(1%, 3%);
  }

  100% {
    transform: translate(-2%, -1%);
  }
}

@media (max-width: 900px) {
  .lightbox__header {
    padding: 20px;
  }

  .lightbox__header-actions {
    gap: 16px;
  }

  .lightbox__stage {
    padding:
      75px
      20px
      95px;
  }

  .lightbox__image-wrapper img {
    max-width: 100%;
    max-height: calc(100vh - 190px);
  }

  .lightbox__caption {
    width: 100%;
    grid-template-columns:
      28px
      minmax(0, 1fr);
  }

  .lightbox__total {
    display: none;
  }

  .lightbox__navigation-area {
    display: none;
  }

  .lightbox__desktop-hint {
    display: none;
  }

  .lightbox__mobile-navigation {
    position: absolute;
    right: 20px;
    bottom: 25px;
    left: 20px;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lightbox__mobile-navigation button {
    color: #d5d5d5;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .lightbox__mobile-navigation span {
    color: #777777;
    font-size: 8px;
    letter-spacing: 0.12em;
  }
}

@media (max-width: 520px) {
  .lightbox__brand span {
    font-size: 13px;
  }

  .lightbox__header-actions button:first-child {
    display: none;
  }

  .lightbox__stage {
    padding-top: 65px;
  }

  .lightbox__image-wrapper img {
    max-height: calc(100vh - 175px);
  }

  .lightbox__details h2 {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .photo-next-enter-active,
  .photo-next-leave-active,
  .photo-previous-enter-active,
  .photo-previous-leave-active {
    transition: opacity 200ms ease;
  }

  .photo-next-enter-from,
  .photo-next-leave-to,
  .photo-previous-enter-from,
  .photo-previous-leave-to {
    transform: none;
  }

  .lightbox__grain {
    animation: none;
  }
}
</style>