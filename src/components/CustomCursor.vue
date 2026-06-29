<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const cursor = ref(null)
const label = ref('')
const isVisible = ref(false)
const isActive = ref(false)

let animationFrame = null
let currentX = -100
let currentY = -100
let targetX = -100
let targetY = -100
let finePointer = false

const animateCursor = () => {
  currentX += (targetX - currentX) * 0.17
  currentY += (targetY - currentY) * 0.17

  if (cursor.value) {
    cursor.value.style.transform = `
      translate3d(${currentX}px, ${currentY}px, 0)
      translate(-50%, -50%)
    `
  }

  animationFrame = requestAnimationFrame(animateCursor)
}

const handlePointerMove = (event) => {
  targetX = event.clientX
  targetY = event.clientY
  isVisible.value = true
}

const handlePointerOver = (event) => {
  const interactiveElement = event.target.closest('[data-cursor]')

  if (!interactiveElement) {
    return
  }

  label.value = interactiveElement.dataset.cursor || 'View'
  isActive.value = true
}

const handlePointerOut = (event) => {
  const interactiveElement = event.target.closest('[data-cursor]')

  if (!interactiveElement) {
    return
  }

  if (
    event.relatedTarget &&
    interactiveElement.contains(event.relatedTarget)
  ) {
    return
  }

  label.value = ''
  isActive.value = false
}

const handlePointerLeave = () => {
  isVisible.value = false
  isActive.value = false
  label.value = ''
}

const handlePointerEnter = () => {
  isVisible.value = true
}

onMounted(() => {
  finePointer = window.matchMedia('(pointer: fine)').matches

  if (!finePointer) {
    return
  }

  document.documentElement.classList.add('has-custom-cursor')

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerleave', handlePointerLeave)
  window.addEventListener('pointerenter', handlePointerEnter)

  document.addEventListener('pointerover', handlePointerOver)
  document.addEventListener('pointerout', handlePointerOut)

  animationFrame = requestAnimationFrame(animateCursor)
})

onUnmounted(() => {
  document.documentElement.classList.remove('has-custom-cursor')

  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', handlePointerLeave)
  window.removeEventListener('pointerenter', handlePointerEnter)

  document.removeEventListener('pointerover', handlePointerOver)
  document.removeEventListener('pointerout', handlePointerOut)

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div
    ref="cursor"
    class="custom-cursor"
    :class="{
      'is-visible': isVisible,
      'is-active': isActive,
    }"
    aria-hidden="true"
  >
    <span class="custom-cursor__label">
      {{ label }}
    </span>
  </div>
</template>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20000;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: difference;
  transition:
    width 350ms cubic-bezier(0.2, 0.7, 0, 1),
    height 350ms cubic-bezier(0.2, 0.7, 0, 1),
    background-color 350ms ease,
    opacity 200ms ease;
  will-change: transform, width, height;
}

.custom-cursor.is-visible {
  opacity: 1;
}

.custom-cursor.is-active {
  width: 84px;
  height: 84px;
  background: rgba(255, 255, 255, 0.14);
}

.custom-cursor__label {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.15em;
  opacity: 0;
  text-transform: uppercase;
  transform: translateY(8px);
  transition:
    opacity 250ms ease,
    transform 350ms cubic-bezier(0.2, 0.7, 0, 1);
}

.custom-cursor.is-active .custom-cursor__label {
  opacity: 1;
  transform: translateY(0);
}

@media (pointer: coarse), (max-width: 900px) {
  .custom-cursor {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .custom-cursor {
    display: none;
  }
}
</style>