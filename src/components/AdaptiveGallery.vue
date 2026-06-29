<script setup>
import {
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmartImage from '@/components/SmartImage.vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },

  archiveMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'select',
  'active-change',
])

const gallery = ref(null)
const orientations = ref({})

let context = null
let observer = null

const visibilityRatios = new Map()

const getPatternClass = (index) => {
  return `adaptive-gallery__item--${(index % 6) + 1}`
}

const getOrientation = (photo) => {
  return (
    orientations.value[photo.id] ||
    photo.orientation ||
    'unknown'
  )
}

const detectOrientation = (photoId, event) => {
  const image = event.target
  const ratio = image.naturalWidth / image.naturalHeight

  let orientation = 'square'

  if (ratio > 1.08) {
    orientation = 'landscape'
  } else if (ratio < 0.92) {
    orientation = 'portrait'
  }

  orientations.value = {
    ...orientations.value,
    [photoId]: orientation,
  }

  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

const updateActivePhoto = () => {
  let activeIndex = 0
  let highestRatio = 0

  visibilityRatios.forEach((ratio, index) => {
    if (ratio > highestRatio) {
      highestRatio = ratio
      activeIndex = index
    }
  })

  if (highestRatio > 0) {
    emit('active-change', activeIndex)
  }
}

const setupIntersectionObserver = () => {
  const items = gallery.value?.querySelectorAll(
    '.adaptive-gallery__item',
  )

  if (!items?.length) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index)

        visibilityRatios.set(
          index,
          entry.isIntersecting
            ? entry.intersectionRatio
            : 0,
        )
      })

      updateActivePhoto()
    },
    {
      root: null,
      rootMargin: '-18% 0px -18% 0px',
      threshold: [
        0,
        0.1,
        0.25,
        0.4,
        0.55,
        0.7,
        0.85,
        1,
      ],
    },
  )

  items.forEach((item) => {
    observer.observe(item)
  })
}

const setupAnimations = () => {
  context = gsap.context(() => {
    const items = gsap.utils.toArray(
      '.adaptive-gallery__item',
    )

    items.forEach((item) => {
      gsap.from(item, {
        y: 100,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          once: true,
        },
      })
    })

    const frames = gsap.utils.toArray(
      '.adaptive-gallery__frame',
    )

    frames.forEach((frame, index) => {
      gsap.fromTo(
        frame,
        {
          y: index % 2 === 0 ? 35 : 65,
        },
        {
          y: index % 2 === 0 ? -25 : -45,
          ease: 'none',

          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        },
      )
    })
  }, gallery.value)
}

onMounted(async () => {
  await nextTick()

  setupAnimations()
  setupIntersectionObserver()

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  observer?.disconnect()
  visibilityRatios.clear()

  if (context) {
    context.revert()
  }
})
</script>

<template>
  <section
    ref="gallery"
    class="adaptive-gallery page-section"
    :class="{
      'adaptive-gallery--archive': archiveMode,
    }"
  >
    <article
      v-for="(photo, index) in photos"
      :key="photo.id"
      class="adaptive-gallery__item"
      :class="[
        getPatternClass(index),
        `is-${getOrientation(photo)}`
      ]"
      :data-index="index"
    >
      <button
        class="adaptive-gallery__button"
        type="button"
        data-cursor="View"
        :aria-label="`Open ${photo.title}`"
        @click="emit('select', index)"
      >
        <figure class="adaptive-gallery__card">
          <div class="adaptive-gallery__frame">
            <SmartImage
            :src="photo.image"
            :alt="photo.title"
            :archive-mode="archiveMode"
            @load="detectOrientation(photo.id, $event)"
          />
          </div>

          <figcaption class="adaptive-gallery__meta">
            <span class="adaptive-gallery__number">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <div>
              <h2>{{ photo.title }}</h2>

              <p>
                {{ photo.location }}
                <span>/</span>
                {{ photo.year }}
              </p>
            </div>
          </figcaption>
        </figure>
      </button>
    </article>
  </section>
</template>

<style scoped>
.adaptive-gallery {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(90px, 10vw, 160px) 24px;
  padding-bottom: 180px;
}

.adaptive-gallery__item {
  min-width: 0;
}

.adaptive-gallery__item--1 {
  grid-column: 1 / span 7;
}

.adaptive-gallery__item--2 {
  grid-column: 9 / span 4;
  margin-top: 150px;
}

.adaptive-gallery__item--3 {
  grid-column: 2 / span 4;
}

.adaptive-gallery__item--4 {
  grid-column: 7 / span 6;
  margin-top: 80px;
}

.adaptive-gallery__item--5 {
  grid-column: 1 / span 5;
}

.adaptive-gallery__item--6 {
  grid-column: 8 / span 4;
  margin-top: 140px;
}

.adaptive-gallery__item.is-portrait.adaptive-gallery__item--1 {
  grid-column: 2 / span 4;
}

.adaptive-gallery__item.is-portrait.adaptive-gallery__item--4 {
  grid-column: 8 / span 4;
}

.adaptive-gallery__item.is-landscape.adaptive-gallery__item--2 {
  grid-column: 7 / span 6;
}

.adaptive-gallery__item.is-landscape.adaptive-gallery__item--3 {
  grid-column: 2 / span 7;
}

.adaptive-gallery__button {
  width: 100%;
  padding: 0;
  color: inherit;
  text-align: left;
}

.adaptive-gallery__card {
  width: 100%;
  margin: 0;
}

.adaptive-gallery__frame {
  width: 100%;
  overflow: hidden;
  background: rgba(120, 120, 120, 0.12);
  will-change: transform;
}

.adaptive-gallery__frame
  :deep(.smart-image img) {
  transition:
    opacity 500ms ease,
    transform 800ms
      cubic-bezier(0.2, 0.7, 0, 1);
}

.adaptive-gallery__button:hover
  .adaptive-gallery__frame
  :deep(.smart-image img) {
  transform: scale(1.035);
}

.adaptive-gallery__meta {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.adaptive-gallery__number {
  color: #6b6b6b;
  font-size: 9px;
}

.adaptive-gallery__meta h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.025em;
}

.adaptive-gallery__meta p {
  margin: 6px 0 0;
  color: #6b6b6b;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.adaptive-gallery__meta p span {
  margin-inline: 5px;
}

.adaptive-gallery--archive .adaptive-gallery__card {
  padding: 12px 12px 28px;
  background: #d5d1c8;
  color: #151515;
  box-shadow: 0 35px 90px rgba(0, 0, 0, 0.42);
}

.adaptive-gallery--archive
  .adaptive-gallery__frame {
  background: #b8b5ae;
}

.adaptive-gallery--archive
  .adaptive-gallery__meta {
  margin-top: 12px;
}

.adaptive-gallery--archive
  .adaptive-gallery__meta h2 {
  font-size: 15px;
  font-weight: 500;
}

.adaptive-gallery--archive
  .adaptive-gallery__number,
.adaptive-gallery--archive
  .adaptive-gallery__meta p {
  color: #666666;
}

.adaptive-gallery--archive
  .adaptive-gallery__item:nth-child(3n + 1)
  .adaptive-gallery__card {
  transform: rotate(-1.2deg);
}

.adaptive-gallery--archive
  .adaptive-gallery__item:nth-child(3n + 2)
  .adaptive-gallery__card {
  transform: rotate(1deg);
}

.adaptive-gallery--archive
  .adaptive-gallery__item:nth-child(3n + 3)
  .adaptive-gallery__card {
  transform: rotate(-0.4deg);
}

@media (max-width: 900px) {
  .adaptive-gallery {
    grid-template-columns: 1fr;
    gap: 90px;
    padding-bottom: 120px;
  }

  .adaptive-gallery__item,
  .adaptive-gallery__item--1,
  .adaptive-gallery__item--2,
  .adaptive-gallery__item--3,
  .adaptive-gallery__item--4,
  .adaptive-gallery__item--5,
  .adaptive-gallery__item--6,
  .adaptive-gallery__item.is-portrait,
  .adaptive-gallery__item.is-landscape {
    grid-column: auto;
    margin-top: 0;
  }

  .adaptive-gallery__item.is-portrait {
    width: min(78%, 520px);
  }

  .adaptive-gallery__item.is-landscape {
    width: 100%;
  }

  .adaptive-gallery__item.is-square {
    width: 88%;
  }

  .adaptive-gallery__item:nth-child(even) {
    margin-left: auto;
  }

  .adaptive-gallery__item:nth-child(odd) {
    margin-right: auto;
  }
}

@media (max-width: 520px) {
  .adaptive-gallery {
    gap: 75px;
  }

  .adaptive-gallery__item.is-portrait {
    width: 84%;
  }

  .adaptive-gallery__item.is-square {
    width: 94%;
  }

  .adaptive-gallery__meta {
    grid-template-columns: 28px minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .adaptive-gallery__frame {
    transform: none !important;
  }

  .adaptive-gallery__frame img {
    transition: none;
  }
}

/* Mobile Responsive */

@media (max-width: 900px) {

@media (max-width: 900px) {

  .adaptive-gallery {
    grid-template-columns: 1fr;
    gap: 90px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 120px;
  }

  .adaptive-gallery__item {
    grid-column: auto !important;
    margin-top: 0 !important;
  }

  .adaptive-gallery__item.is-portrait {
    width: min(78%, 520px);
  }

  .adaptive-gallery__item.is-landscape {
    width: 100%;
  }

  .adaptive-gallery__item.is-square {
    width: 88%;
  }

  .adaptive-gallery__frame {
    width: 100%;
  }

}


@media (max-width: 520px) {

  .adaptive-gallery {
    gap: 70px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .adaptive-gallery__item.is-portrait {
    width: 90%;
  }

  .adaptive-gallery__item.is-landscape {
    width: 100%;
  }

  .adaptive-gallery__item.is-square {
    width: 96%;
  }

  .adaptive-gallery__meta {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 12px;
  }

  .adaptive-gallery__meta h2 {
    font-size: 14px;
  }

  .adaptive-gallery__meta p {
    font-size: 8px;
  }

  .adaptive-gallery--archive
  .adaptive-gallery__card {
    padding: 10px 10px 22px;
  }

}
}
</style>