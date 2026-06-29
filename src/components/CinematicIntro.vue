<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const landscapeImage =
  '/images/landscape/landscape-01.png'

const archiveImage =
  '/images/old-archive/archive-01.png'

gsap.registerPlugin(ScrollTrigger)

const section = ref(null)
const landscapeLayer = ref(null)
const archiveLayer = ref(null)
const title = ref(null)
const scrollText = ref(null)

let context = null

onMounted(() => {
  context = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })

    timeline
      .to(
        landscapeLayer.value,
        {
          scale: 1.12,
          filter: 'saturate(0.65) brightness(0.72)',
          ease: 'none',
        },
        0,
      )
      .to(
        title.value,
        {
          yPercent: -70,
          opacity: 0,
          ease: 'none',
        },
        0.1,
      )
      .to(
        scrollText.value,
        {
          opacity: 0,
          ease: 'none',
        },
        0.1,
      )
      .fromTo(
        archiveLayer.value,
        {
          clipPath: 'inset(100% 0% 0% 0%)',
          scale: 1.08,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          ease: 'none',
        },
        0.45,
      )
  }, section.value)
})

onUnmounted(() => {
  if (context) {
    context.revert()
  }
})
</script>

<template>
  <section ref="section" class="cinematic-intro">
    <div class="cinematic-intro__sticky">
      <div ref="landscapeLayer" class="cinematic-intro__image cinematic-intro__landscape">
        <img :src="landscapeImage" alt="Mountain landscape" />
      </div>

      <div ref="archiveLayer" class="cinematic-intro__image cinematic-intro__archive">
        <img :src="archiveImage" alt="Old archive photograph" />
        <div class="cinematic-intro__grain"></div>
      </div>

      <div class="cinematic-intro__overlay"></div>

      <div ref="title" class="cinematic-intro__title">
        <p>Visual Archive</p>
        <h1>HSWLD</h1>
        <span>Landscape and fragments of time</span>
      </div>

      <div ref="scrollText" class="cinematic-intro__scroll">
        <span>Scroll to enter</span>
        <div class="cinematic-intro__line"></div>
      </div>

      <div class="cinematic-intro__counter">
        <span>01</span>
        <span>02</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cinematic-intro {
  position: relative;
  height: 280vh;
  background: #080808;
}

.cinematic-intro__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.cinematic-intro__image {
  position: absolute;
  inset: 0;
  will-change: transform, clip-path, filter;
}

.cinematic-intro__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cinematic-intro__landscape {
  transform: scale(1);
}

.cinematic-intro__archive {
  z-index: 2;
  filter: grayscale(1) contrast(1.08);
  clip-path: inset(100% 0% 0% 0%);
}

.cinematic-intro__overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  background:
    linear-gradient(to top, rgba(0, 0, 0, 0.62), transparent 48%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent 40%);
  pointer-events: none;
}

.cinematic-intro__grain {
  position: absolute;
  inset: -100%;
  z-index: 3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E");
  opacity: 0.16;
  animation: grain 0.28s steps(2) infinite;
  pointer-events: none;
}

.cinematic-intro__title {
  position: absolute;
  bottom: 11vh;
  left: var(--page-padding);
  z-index: 5;
  max-width: 850px;
  will-change: transform, opacity;
}

.cinematic-intro__title p {
  margin: 0 0 14px;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.cinematic-intro__title h1 {
  margin: 0;
  font-size: clamp(50px, 10vw, 158px);
  font-weight: 300;
  line-height: 0.85;
  letter-spacing: -0.075em;
}

.cinematic-intro__title span {
  display: block;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.cinematic-intro__scroll {
  position: absolute;
  right: var(--page-padding);
  bottom: 42px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.cinematic-intro__line {
  width: 64px;
  height: 1px;
  background: rgba(255, 255, 255, 0.72);
}

.cinematic-intro__counter {
  position: absolute;
  top: 50%;
  right: var(--page-padding);
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 100px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 9px;
}

@keyframes grain {
  0% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(3%, -2%);
  }

  50% {
    transform: translate(-2%, 3%);
  }

  75% {
    transform: translate(2%, 2%);
  }

  100% {
    transform: translate(-3%, -2%);
  }
}

@media (max-width: 768px) {
  .cinematic-intro {
    height: 220vh;
  }

  .cinematic-intro__title {
    bottom: 16vh;
  }

  .cinematic-intro__title h1 {
    font-size: clamp(42px, 14vw, 78px);
    line-height: 0.9;
  }

  .cinematic-intro__counter {
    display: none;
  }

  .cinematic-intro__scroll {
    right: auto;
    left: var(--page-padding);
  }
}
</style>