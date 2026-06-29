<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  currentIndex: {
    type: Number,
    default: 0,
  },

  total: {
    type: Number,
    required: true,
  },

  label: {
    type: String,
    required: true,
  },

  archiveMode: {
    type: Boolean,
    default: false,
  },
})

const isVisible = ref(false)

const formattedCurrent = computed(() => {
  return String(props.currentIndex + 1).padStart(2, '0')
})

const formattedTotal = computed(() => {
  return String(props.total).padStart(2, '0')
})

const progress = computed(() => {
  if (!props.total) {
    return 0
  }

  return ((props.currentIndex + 1) / props.total) * 100
})

const handleScroll = () => {
  const showPosition = window.innerHeight * 0.7

  isVisible.value = window.scrollY > showPosition
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, {
    passive: true,
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="gallery-status">
    <aside
      v-if="isVisible"
      class="gallery-status"
      :class="{
        'gallery-status--archive': archiveMode,
      }"
      aria-hidden="true"
    >
      <div class="gallery-status__information">
        <span class="gallery-status__label">
          {{ label }}
        </span>

        <div class="gallery-status__counter">
          <span>{{ formattedCurrent }}</span>
          <span class="gallery-status__separator">/</span>
          <span>{{ formattedTotal }}</span>
        </div>
      </div>

      <div class="gallery-status__track">
        <span
          class="gallery-status__progress"
          :style="{ width: `${progress}%` }"
        ></span>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.gallery-status {
  position: fixed;
  right: var(--page-padding);
  bottom: 28px;
  z-index: 700;
  width: clamp(180px, 18vw, 280px);
  color: #111111;
  pointer-events: none;
  mix-blend-mode: normal;
}

.gallery-status--archive {
  color: #ffffff;
}

.gallery-status--archive .gallery-status__track {
  background: rgba(255, 255, 255, 0.3);
}

.gallery-status__information {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 10px;
}

.gallery-status__label {
  overflow: hidden;
  max-width: 130px;
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.gallery-status__counter {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.gallery-status__separator {
  opacity: 0.4;
}

.gallery-status__track {
  position: relative;
  width: 100%;
  height: 1px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.25);
}

.gallery-status__progress {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  height: 100%;
  background: currentColor;
  transition: width 600ms cubic-bezier(0.2, 0.7, 0, 1);
}

.gallery-status-enter-active,
.gallery-status-leave-active {
  transition:
    opacity 350ms ease,
    transform 450ms cubic-bezier(0.2, 0.7, 0, 1);
}

.gallery-status-enter-from,
.gallery-status-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .gallery-status {
    right: 20px;
    bottom: 20px;
    width: 150px;
  }

  .gallery-status__label {
    max-width: 80px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-status__progress {
    transition: none;
  }
}
</style>