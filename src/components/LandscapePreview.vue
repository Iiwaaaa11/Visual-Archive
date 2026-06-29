<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import imageOne from '@/assets/images/landscape/landscape-26.png'
import imageTwo from '@/assets/images/landscape/landscape-02.png'
import imageThree from '@/assets/images/landscape/landscape-03.png'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)

let context = null

onMounted(() => {
  context = gsap.context(() => {
    const figures = gsap.utils.toArray(
      '.landscape-preview__figure',
    )

    figures.forEach((figure, index) => {
      gsap.from(figure, {
        y: 90,
        opacity: 0,
        duration: 1.1,
        delay: index * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: figure,
          start: 'top 85%',
          once: true,
        },
      })
    })

    const images = gsap.utils.toArray(
      '.landscape-preview__image',
    )

    images.forEach((image, index) => {
      gsap.fromTo(
        image,
        {
          y: index % 2 === 0 ? 50 : 90,
        },
        {
          y: index % 2 === 0 ? -30 : -55,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        },
      )
    })
  }, section.value)
})

onUnmounted(() => {
  if (context) {
    context.revert()
  }
})
</script>

<template>
  <section
    ref="section"
    class="landscape-preview page-section"
  >
    <div class="landscape-preview__top">
      <div class="landscape-preview__heading">
        <span class="section-label">
          Landscape
        </span>

        <h2>
          Nature remains after we leave.
        </h2>
      </div>

      <p class="landscape-preview__description">
        Mountains, distant light, quiet roads, and
        places found between one journey and another.
      </p>
    </div>

    <div class="landscape-preview__gallery">
      <figure
        class="
          landscape-preview__figure
          landscape-preview__figure--large
        "
      >
        <button
          class="landscape-preview__button"
          type="button"
        >
          <div class="landscape-preview__image">
            <img
              :src="imageOne"
              alt="Mountain landscape"
            />
          </div>
        </button>

        <figcaption>
          <span>01</span>
          <span>Temanggung, Central Java</span>
        </figcaption>
      </figure>

      <figure
        class="
          landscape-preview__figure
          landscape-preview__figure--small-top
        "
      >
        <button
          class="landscape-preview__button"
          type="button"
        >
          <div class="landscape-preview__image">
            <img
              :src="imageTwo"
              alt="Foggy mountain landscape"
            />
          </div>
        </button>

        <figcaption>
          <span>02</span>
          <span>SILENT CENTER</span>
        </figcaption>
      </figure>

      <figure
        class="
          landscape-preview__figure
          landscape-preview__figure--small-bottom
        "
      >
        <button
          class="landscape-preview__button"
          type="button"
        >
          <div class="landscape-preview__image">
            <img
              :src="imageThree"
              alt="Natural landscape"
            />
          </div>
        </button>

        <figcaption>
          <span>03</span>
          <span>Distant Places</span>
        </figcaption>
      </figure>
    </div>

    <div class="landscape-preview__action">
      <RouterLink
        to="/landscape"
        class="button-link"
      >
        Explore Landscape
        <span>↗</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.landscape-preview {
  min-height: 160vh;
  padding-top: 150px;
  padding-bottom: 160px;
  background: #e7e5df;
  color: #111111;
}

.landscape-preview .section-label {
  color: #636363;
}

.landscape-preview__top {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  align-items: end;
  gap: 70px;
  margin-bottom: 120px;
}

.landscape-preview__heading h2 {
  max-width: 850px;
  margin: 20px 0 0;
  font-size: clamp(48px, 7vw, 110px);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: -0.065em;
}

.landscape-preview__description {
  max-width: 390px;
  margin: 0 0 10px;
  color: #565656;
  font-size: 12px;
  line-height: 1.8;
}

.landscape-preview__gallery {
  position: relative;
  display: grid;
  min-height: 1200px;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 6vw;
}

.landscape-preview__figure {
  margin: 0;
}

.landscape-preview__figure--large {
  width: 100%;
}

.landscape-preview__figure--small-top {
  width: 100%;
  margin-top: 120px;
}

.landscape-preview__figure--small-bottom {
  grid-column: 2;
  width: 78%;
  margin-top: 80px;
}

.landscape-preview__button {
  width: 100%;
  padding: 0;
  color: inherit;
}

.landscape-preview__image {
  width: 100%;
  overflow: hidden;
  background: #d5d2ca;
  will-change: transform;
}

.landscape-preview__figure--large
  .landscape-preview__image {
  aspect-ratio: 1 / 1;
}

.landscape-preview__figure--small-top
  .landscape-preview__image {
  aspect-ratio: 4 / 5;
}

.landscape-preview__figure--small-bottom
  .landscape-preview__image {
  aspect-ratio: 1 / 1;
}

.landscape-preview__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 800ms
    cubic-bezier(0.2, 0.7, 0, 1);
}

.landscape-preview__button:hover
  .landscape-preview__image img {
  transform: scale(1.045);
}

.landscape-preview figcaption {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 12px;
  color: #585858;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.landscape-preview__action {
  display: flex;
  justify-content: flex-end;
  margin-top: 120px;
}

@media (max-width: 900px) {
  .landscape-preview {
    min-height: auto;
    padding-top: 100px;
    padding-bottom: 110px;
  }

  .landscape-preview__top {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 70px;
  }

  .landscape-preview__gallery {
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 90px;
  }

  .landscape-preview__figure--small-top,
  .landscape-preview__figure--small-bottom {
    width: 78%;
    margin-top: 0;
    margin-left: auto;
  }

  .landscape-preview__figure--small-bottom {
    grid-column: auto;
    margin-right: auto;
    margin-left: 0;
  }
}

@media (max-width: 520px) {
  .landscape-preview__figure--small-top,
  .landscape-preview__figure--small-bottom {
    width: 88%;
  }

  .landscape-preview figcaption {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
</style>