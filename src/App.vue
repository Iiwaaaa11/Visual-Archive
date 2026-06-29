<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import CustomCursor from '@/components/CustomCursor.vue'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()

const transitionPanel = ref(null)
const transitionText = ref(null)

const transitionLabel = computed(() => {
  return route.meta.transitionLabel || 'HSWLD'
})

let lenis = null
let animationFrame = null

const animateScroll = (time) => {
  if (lenis) {
    lenis.raf(time)
  }

  animationFrame = requestAnimationFrame(animateScroll)
}

const beforeLeave = () => {
  lenis?.stop()

  gsap.set(transitionPanel.value, {
    yPercent: 100,
  })

  gsap.set(transitionText.value, {
    y: 40,
    opacity: 0,
  })
}

const leavePage = (element, done) => {
  const timeline = gsap.timeline({
    onComplete: done,
  })

  timeline
    .to(
      element,
      {
        opacity: 0.25,
        duration: 0.35,
        ease: 'power2.out',
      },
      0,
    )
    .to(
      transitionPanel.value,
      {
        yPercent: 0,
        duration: 0.8,
        ease: 'power4.inOut',
      },
      0,
    )
}

const beforeEnter = (element) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto',
  })

  lenis?.scrollTo(0, {
    immediate: true,
  })

  gsap.set(element, {
    opacity: 0,
  })

  gsap.set(transitionPanel.value, {
    yPercent: 0,
  })
}

const enterPage = async (element, done) => {
  await nextTick()

  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(transitionPanel.value, {
        yPercent: 100,
      })

      gsap.set(transitionText.value, {
        y: 40,
        opacity: 0,
      })

      lenis?.start()

      ScrollTrigger.clearScrollMemory()
      ScrollTrigger.refresh()

      done()
    },
  })

  timeline
    .set(element, {
      opacity: 1,
    })
    .to(transitionText.value, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      ease: 'power3.out',
    })
    .to(
      transitionText.value,
      {
        y: -35,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
      },
      '+=0.15',
    )
    .to(
      transitionPanel.value,
      {
        yPercent: -100,
        duration: 0.85,
        ease: 'power4.inOut',
      },
      '-=0.2',
    )
}

onMounted(() => {
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
  })

  lenis.on('scroll', ScrollTrigger.update)

  animationFrame = requestAnimationFrame(animateScroll)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  if (lenis) {
    lenis.destroy()
  }
})
</script>

<template>
  <div class="app">
    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition
        mode="out-in"
        :css="false"
        @before-leave="beforeLeave"
        @leave="leavePage"
        @before-enter="beforeEnter"
        @enter="enterPage"
      >
        <component
          :is="Component"
          :key="currentRoute.fullPath"
          class="route-page"
        />
      </Transition>
    </RouterView>

    <CustomCursor />

    <div
      ref="transitionPanel"
      class="page-transition"
      aria-hidden="true"
    >
      <div class="page-transition__brand">
        <span ref="transitionText" class="page-transition__label">
          {{ transitionLabel }}
        </span>

        <span class="page-transition__subtitle">
          Visual Archive
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.app {
  position: relative;
  min-height: 100vh;
}

.route-page {
  min-height: 100vh;
}

.page-transition {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-items: center;
  background: #080808;
  color: #f2f0ea;
  pointer-events: none;
  transform: translateY(100%);
  will-change: transform;
}

.page-transition__brand {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  text-align: center;
}

.page-transition__label {
  display: block;
  font-size: clamp(34px, 7vw, 94px);
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -0.065em;
  text-transform: uppercase;
  will-change: transform, opacity;
}

.page-transition__subtitle {
  color: #777777;
  font-size: 9px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) {
  .page-transition {
    display: none;
  }
}
</style>