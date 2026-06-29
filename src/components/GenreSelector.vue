<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import landscapeImage from '@/assets/images/landscape/landscape-02.png'
import archiveImage from '@/assets/images/old-archive/archive-02.png'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
let context = null

onMounted(() => {
  context = gsap.context(() => {
    gsap.from('.genre-selector__heading > *', {
      y: 70,
      opacity: 0,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.genre-selector__heading',
        start: 'top 82%',
      },
    })

    gsap.from('.genre-card', {
      y: 100,
      opacity: 0,
      stagger: 0.18,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.genre-selector__grid',
        start: 'top 78%',
      },
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
      class="genre-selector page-section"
    >
    <div class="genre-selector__heading">
      <span class="section-label">Select an archive</span>
      <h2>Two ways of remembering.</h2>
    </div>

    <div class="genre-selector__grid">
      <RouterLink
        to="/landscape"
        class="genre-card genre-card--landscape"
        data-cursor="Enter"
      >
        <div class="genre-card__image">
          <img :src="landscapeImage" alt="Landscape gallery" />
        </div>

        <div class="genre-card__shade"></div>

        <div class="genre-card__content">
          <div class="genre-card__number">01</div>

          <div>
            <h3>Landscape</h3>
            <p>Nature, light, and distant places.</p>
          </div>

          <span class="genre-card__arrow">↗</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/old-archive"
        class="genre-card genre-card--archive"
        data-cursor="Enter"
      >
        <div class="genre-card__image">
          <img :src="archiveImage" alt="Old archive gallery" />
        </div>

        <div class="genre-card__grain"></div>
        <div class="genre-card__shade"></div>

        <div class="genre-card__content">
          <div class="genre-card__number">02</div>

          <div>
            <h3>Old Archive</h3>
            <p>Fragments of time, preserved in monochrome.</p>
          </div>

          <span class="genre-card__arrow">↗</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.genre-selector {
  padding-top: 150px;
  padding-bottom: 160px;
  background: #0a0a0a;
}

.genre-selector__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 70px;
}

.genre-selector__heading h2 {
  max-width: 700px;
  margin: 0;
  font-size: clamp(40px, 6vw, 88px);
  font-weight: 300;
  line-height: 0.94;
  letter-spacing: -0.06em;
}

.genre-selector__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.genre-card {
  position: relative;
  height: min(72vh, 800px);
  overflow: hidden;
  background: #151515;
}

.genre-card__image {
  position: absolute;
  inset: 0;
  transition: transform 900ms cubic-bezier(0.2, 0.7, 0, 1);
}

.genre-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.genre-card--archive .genre-card__image {
  filter: grayscale(1) contrast(1.08);
}

.genre-card:hover .genre-card__image {
  transform: scale(1.055);
}

.genre-card__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.82), transparent 58%);
}

.genre-card__grain {
  position: absolute;
  inset: 0;
  z-index: 2;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E");
  opacity: 0.24;
  pointer-events: none;
}

.genre-card__content {
  position: absolute;
  inset: auto 0 0;
  z-index: 3;
  display: grid;
  grid-template-columns: 45px 1fr auto;
  align-items: end;
  gap: 16px;
  padding: 30px;
}

.genre-card__number {
  padding-bottom: 7px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 10px;
}

.genre-card__content h3 {
  margin: 0;
  font-size: clamp(32px, 4vw, 60px);
  font-weight: 300;
  letter-spacing: -0.055em;
}

.genre-card__content p {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 11px;
}

.genre-card__arrow {
  padding-bottom: 7px;
  font-size: 20px;
  transition: transform 300ms ease;
}

.genre-card:hover .genre-card__arrow {
  transform: translate(5px, -5px);
}

@media (max-width: 900px) {
  .genre-selector {
    padding-top: 100px;
    padding-bottom: 110px;
  }

  .genre-selector__heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .genre-selector__grid {
    grid-template-columns: 1fr;
  }

  .genre-card {
    height: 70vh;
    min-height: 520px;
  }
}

@media (max-width: 520px) {
  .genre-card {
    height: 68vh;
    min-height: 480px;
  }

  .genre-card__content {
    grid-template-columns: 30px 1fr auto;
    padding: 22px 18px;
  }
}
</style>