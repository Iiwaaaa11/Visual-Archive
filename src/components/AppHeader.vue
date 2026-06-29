<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const header = ref(null)
const menuOpen = ref(false)

let lastScrollPosition = 0
let scrollHandler = null

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value

  document.body.classList.toggle('no-scroll', menuOpen.value)
}

const closeMenu = () => {
  menuOpen.value = false
  document.body.classList.remove('no-scroll')
}

onMounted(() => {
  scrollHandler = () => {
    const currentScrollPosition = window.scrollY

    if (!header.value || menuOpen.value) return

    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 120) {
      gsap.to(header.value, {
        yPercent: -120,
        duration: 0.45,
        ease: 'power3.out',
      })
    } else {
      gsap.to(header.value, {
        yPercent: 0,
        duration: 0.45,
        ease: 'power3.out',
      })
    }

    lastScrollPosition = currentScrollPosition
  }

  window.addEventListener('scroll', scrollHandler)
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <header ref="header" class="site-header">
    <RouterLink to="/" class="site-header__brand" @click="closeMenu">
      <span class="site-header__title">HSWLD</span>
      <span class="site-header__subtitle">Visual Archive</span>
    </RouterLink>

    <button
      class="menu-button"
      type="button"
      :data-cursor="menuOpen ? 'Close' : 'Menu'"
      @click="toggleMenu"
    >
      {{ menuOpen ? 'Close' : 'Index' }}
    </button>

    <Transition name="menu">
      <nav v-if="menuOpen" class="fullscreen-menu">
        <div class="fullscreen-menu__background"></div>

        <div class="fullscreen-menu__content">
          <div class="fullscreen-menu__label">Index</div>

          <div class="fullscreen-menu__links">
            <RouterLink
              to="/"
              data-cursor="Open"
              @click="closeMenu"
            >
              <span>01</span>
              <strong>Home</strong>
            </RouterLink>

            <RouterLink to="/landscape" @click="closeMenu">
              <span>02</span>
              <strong>Landscape</strong>
            </RouterLink>

            <RouterLink to="/old-archive" @click="closeMenu">
              <span>03</span>
              <strong>Old Archive</strong>
            </RouterLink>

            <RouterLink to="/about" @click="closeMenu">
              <span>04</span>
              <strong>About</strong>
            </RouterLink>
          </div>

          <div class="fullscreen-menu__footer">
            <span>Indonesia</span>
            <span>Photography archive</span>
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 900;
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px var(--page-padding);
  mix-blend-mode: difference;
  color: #ffffff;
}

.site-header__brand {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.site-header__title {
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.03em;
}

.site-header__subtitle {
  font-size: 8px;
  letter-spacing: 0.18em;
  opacity: 0.68;
  text-transform: uppercase;
}

.menu-button {
  position: relative;
  z-index: 920;
  color: #ffffff;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.fullscreen-menu {
  position: fixed;
  inset: 0;
  z-index: 910;
  overflow: hidden;
  background: #0a0a0a;
  color: #f2f0ea;
  mix-blend-mode: normal;
}

.fullscreen-menu__background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.07), transparent 35%),
    #0a0a0a;
}

.fullscreen-menu__content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 110px var(--page-padding) 34px;
}

.fullscreen-menu__label {
  color: #666666;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.fullscreen-menu__links {
  display: flex;
  flex-direction: column;
}

.fullscreen-menu__links a {
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  padding-block: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.fullscreen-menu__links span {
  color: #666666;
  font-size: 10px;
}

.fullscreen-menu__links strong {
  font-size: clamp(38px, 7vw, 100px);
  font-weight: 300;
  letter-spacing: -0.06em;
  transition: transform 300ms ease;
}

.fullscreen-menu__links a:hover strong {
  transform: translateX(20px);
}

.fullscreen-menu__footer {
  display: flex;
  justify-content: space-between;
  color: #6f6f6f;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 500ms ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>