<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import imageOne from '@/assets/images/old-archive/archive-01.png'
import imageTwo from '@/assets/images/old-archive/archive-02.png'
import imageThree from '@/assets/images/old-archive/archive-03.png'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
let context = null

onMounted(() => {
  context = gsap.context(() => {
    gsap.from('.archive-preview__photo', {
      y: 100,
      rotate: 0,
      opacity: 0,
      stagger: 0.15,
      duration: 1.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.archive-preview__stack',
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
  <section ref="section" class="archive-preview page-section">
    <div class="archive-preview__grain"></div>

    <div class="archive-preview__heading">
      <span class="section-label">Old Archive</span>
      <h2>Fragments that time refused to erase.</h2>
    </div>

    <div class="archive-preview__content">
      <div class="archive-preview__stack">
        <figure class="archive-preview__photo archive-preview__photo--one">
          <img :src="imageOne" alt="Old archive photo" />
          <figcaption>Archive 01</figcaption>
        </figure>

        <figure class="archive-preview__photo archive-preview__photo--two">
          <img :src="imageTwo" alt="Black and white archive photo" />
          <figcaption>Archive 02</figcaption>
        </figure>

        <figure class="archive-preview__photo archive-preview__photo--three">
          <img :src="imageThree" alt="Old monochrome photo" />
          <figcaption>Archive 03</figcaption>
        </figure>
      </div>

      <div class="archive-preview__description">
        <p>
          Monochrome photographs, imperfect textures, dust, noise, and moments
          kept as visual remains.
        </p>

        <RouterLink
          to="/old-archive"
          class="button-link"
          data-cursor="Open"
        >
          Open Old Archive
          <span>↗</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.archive-preview {
  position: relative;
  overflow: hidden;
  min-height: 130vh;
  padding-top: 160px;
  padding-bottom: 180px;
  background: #0d0d0d;
  color: #efede7;
}

.archive-preview__grain {
  position: absolute;
  inset: -50%;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.24'/%3E%3C/svg%3E");
  opacity: 0.08;
  animation: archive-grain 0.35s steps(2) infinite;
  pointer-events: none;
}

.archive-preview__heading,
.archive-preview__content {
  position: relative;
  z-index: 2;
}

.archive-preview__heading h2 {
  max-width: 980px;
  margin: 22px 0 0;
  font-size: clamp(46px, 7vw, 110px);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: -0.065em;
}

.archive-preview__content {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  align-items: end;
  gap: 10vw;
  margin-top: 130px;
}

.archive-preview__stack {
  position: relative;
  height: 800px;
}

.archive-preview__photo {
  position: absolute;
  margin: 0;
  padding: 12px 12px 32px;
  background: #d7d4cc;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.archive-preview__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.12);
}

.archive-preview__photo figcaption {
  margin-top: 10px;
  color: #3d3d3d;
  font-size: 8px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.archive-preview__photo--one {
  top: 0;
  left: 2%;
  width: 52%;
  transform: rotate(-5deg);
}

.archive-preview__photo--two {
  top: 170px;
  left: 38%;
  z-index: 2;
  width: 50%;
  transform: rotate(4deg);
}

.archive-preview__photo--three {
  bottom: 0;
  left: 14%;
  z-index: 3;
  width: 46%;
  transform: rotate(-2deg);
}

.archive-preview__description {
  padding-bottom: 40px;
}

.archive-preview__description p {
  max-width: 380px;
  margin: 0 0 60px;
  color: #999999;
  font-size: 12px;
  line-height: 1.9;
}

@keyframes archive-grain {
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
  .archive-preview {
    min-height: auto;
    padding-top: 110px;
    padding-bottom: 120px;
  }

  .archive-preview__content {
    grid-template-columns: 1fr;
    gap: 90px;
    margin-top: 90px;
  }

  .archive-preview__stack {
    height: 680px;
  }

  .archive-preview__description {
    padding-bottom: 0;
  }
}

@media (max-width: 520px) {
  .archive-preview__stack {
    height: 530px;
  }

  .archive-preview__photo--one {
    width: 65%;
  }

  .archive-preview__photo--two {
    top: 125px;
    left: 34%;
    width: 61%;
  }

  .archive-preview__photo--three {
    width: 57%;
  }
}
</style>