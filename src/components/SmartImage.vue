<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  src: {
    type: String,
    required: true,
  },

  alt: {
    type: String,
    default: '',
  },

  eager: {
    type: Boolean,
    default: false,
  },

  archiveMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'load',
  'error',
])

const loaded = ref(false)
const failed = ref(false)

const loadingMode = computed(() => {
  return props.eager ? 'eager' : 'lazy'
})

const fetchPriority = computed(() => {
  return props.eager ? 'high' : 'auto'
})

const handleLoad = (event) => {
  loaded.value = true
  failed.value = false

  emit('load', event)
}

const handleError = (event) => {
  loaded.value = false
  failed.value = true

  emit('error', event)
}

watch(
  () => props.src,
  () => {
    loaded.value = false
    failed.value = false
  },
)
</script>

<template>
  <div
    class="smart-image"
    :class="{
      'is-loaded': loaded,
      'is-failed': failed,
      'is-archive': archiveMode,
    }"
  >
    <div
      v-if="!loaded && !failed"
      class="smart-image__placeholder"
      aria-hidden="true"
    >
      <span></span>
    </div>

    <div
      v-if="failed"
      class="smart-image__error"
    >
      <span>Image unavailable</span>
    </div>

    <img
      v-show="!failed"
      v-bind="$attrs"
      :src="src"
      :alt="alt"
      :loading="loadingMode"
      :fetchpriority="fetchPriority"
      decoding="async"
      draggable="false"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<style scoped>
.smart-image {
  position: relative;
  width: 100%;
  min-height: 80px;
  overflow: hidden;
  background: rgba(100, 100, 100, 0.12);
}

.smart-image img {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition:
    opacity 500ms ease,
    transform 800ms
      cubic-bezier(0.2, 0.7, 0, 1);
}

.smart-image.is-loaded img {
  opacity: 1;
}

.smart-image.is-archive img {
  filter:
    grayscale(1)
    contrast(1.12);
}

.smart-image__placeholder {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  background:
    rgba(120, 120, 120, 0.12);
}

.smart-image__placeholder span {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      105deg,
      transparent 25%,
      rgba(255, 255, 255, 0.16) 42%,
      transparent 60%
    );
  transform: translateX(-100%);
  animation:
    image-loading 1.4s ease infinite;
}

.smart-image__error {
  display: grid;
  min-height: 220px;
  place-items: center;
  border:
    1px solid
    rgba(120, 120, 120, 0.24);
  color: #777777;
}

.smart-image__error span {
  font-size: 8px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.is-archive
  .smart-image__placeholder {
  background: #242424;
}

.is-archive
  .smart-image__error {
  color: #888888;
}

@keyframes image-loading {
  to {
    transform: translateX(100%);
  }
}

@media (
  prefers-reduced-motion: reduce
) {
  .smart-image img {
    transition: opacity 200ms ease;
  }

  .smart-image__placeholder span {
    animation: none;
  }
}
</style>