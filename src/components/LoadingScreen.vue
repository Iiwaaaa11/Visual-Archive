<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  assets: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['complete'])

const loadingScreen = ref(null)
const counter = ref(0)

let progressTween = null
let completionTween = null
let exitTween = null
let componentActive = true

const wait = (duration) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

const preloadImage = (source) => {
  return new Promise((resolve) => {
    const image = new Image()

    const finish = () => {
      image.onload = null
      image.onerror = null
      resolve()
    }

    image.onload = finish
    image.onerror = finish
    image.src = source

    if (image.complete) {
      finish()
    }
  })
}

const preloadAssets = async () => {
  const tasks = props.assets.map((asset) => {
    return preloadImage(asset)
  })

  await Promise.allSettled(tasks)
}

const finishLoading = () => {
  if (!componentActive || !loadingScreen.value) {
    return
  }

  exitTween = gsap.to(loadingScreen.value, {
    yPercent: -100,
    duration: 0.9,
    delay: 0.15,
    ease: 'power4.inOut',

    onComplete: () => {
      document.body.classList.remove('no-scroll')
      emit('complete')
    },
  })
}

onMounted(async () => {
  document.body.classList.add('no-scroll')

  const progress = {
    value: 0,
  }

  progressTween = gsap.to(progress, {
    value: 88,
    duration: 1.4,
    ease: 'power2.out',

    onUpdate: () => {
      counter.value = Math.round(progress.value)
    },
  })

  await Promise.all([
    preloadAssets(),
    wait(1100),
  ])

  if (!componentActive) {
    return
  }

  progressTween?.kill()

  completionTween = gsap.to(progress, {
    value: 100,
    duration: 0.35,
    ease: 'power2.inOut',

    onUpdate: () => {
      counter.value = Math.round(progress.value)
    },

    onComplete: finishLoading,
  })
})

onUnmounted(() => {
  componentActive = false

  progressTween?.kill()
  completionTween?.kill()
  exitTween?.kill()

  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <div
    ref="loadingScreen"
    class="loading-screen"
    role="status"
    aria-live="polite"
  >
    <div class="loading-screen__brand">
      <h1>HSWLD</h1>
      <p>Visual Archive</p>
    </div>

    <div class="loading-screen__progress">
      <span
        class="loading-screen__progress-bar"
        :style="{ width: `${counter}%` }"
      ></span>
    </div>

    <div class="loading-screen__bottom">
      <span>Loading archive</span>

      <span>
        {{ counter.toString().padStart(3, '0') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 36px;
  background: #050505;
  color: #f2f0ea;
  will-change: transform;
}

.loading-screen__brand {
  margin: auto;
  text-align: center;
}

.loading-screen__brand h1 {
  margin: 0;
  font-size: clamp(34px, 7vw, 88px);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.loading-screen__brand p {
  margin: 13px 0 0;
  color: #777777;
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.loading-screen__progress {
  position: absolute;
  right: 36px;
  bottom: 70px;
  left: 36px;
  height: 1px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.12);
}

.loading-screen__progress-bar {
  display: block;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  transition: width 100ms linear;
}

.loading-screen__bottom {
  display: flex;
  justify-content: space-between;
  color: #777777;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .loading-screen {
    padding: 24px 20px;
  }

  .loading-screen__progress {
    right: 20px;
    bottom: 58px;
    left: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-screen__progress-bar {
    transition: none;
  }
}
</style>