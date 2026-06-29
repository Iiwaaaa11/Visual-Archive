<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="not-found-page">
    <AppHeader />

    <main class="not-found">
      <div class="not-found__background">
        <img
          src="/images/landscape/landscape-01.png"
          alt=""
        />
      </div>

      <div class="not-found__overlay"></div>

      <div class="not-found__content">
        <span>404 / Archive not found</span>

        <h1>
          This fragment has disappeared.
        </h1>

        <p>
          The page may have been moved,
          renamed, or removed from the archive.
        </p>

        <RouterLink
          to="/"
          class="not-found__button"
          data-cursor="Return"
        >
          Return to archive
          <span>↗</span>
        </RouterLink>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: #050505;
  color: #f2f0ea;
}

.not-found {
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: flex-end;
  overflow: hidden;
  padding:
    140px
    var(--page-padding)
    70px;
}

.not-found__background,
.not-found__overlay {
  position: absolute;
  inset: 0;
}

.not-found__background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter:
    grayscale(1)
    brightness(0.45);
}

.not-found__overlay {
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9),
      transparent 70%
    ),
    rgba(0, 0, 0, 0.2);
}

.not-found__content {
  position: relative;
  z-index: 2;
  max-width: 1000px;
}

.not-found__content > span {
  color: rgba(255, 255, 255, 0.58);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.not-found__content h1 {
  max-width: 950px;
  margin: 25px 0 0;
  font-size:
    clamp(58px, 10vw, 150px);
  font-weight: 300;
  line-height: 0.86;
  letter-spacing: -0.075em;
}

.not-found__content p {
  max-width: 440px;
  margin: 35px 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  line-height: 1.8;
}

.not-found__button {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  margin-top: 48px;
  padding-bottom: 7px;
  border-bottom:
    1px solid rgba(255, 255, 255, 0.75);
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.not-found__button span {
  transition: transform 300ms ease;
}

.not-found__button:hover span {
  transform: translate(5px, -5px);
}

@media (max-width: 700px) {
  .not-found {
    min-height: 92vh;
    padding-bottom: 45px;
  }

  .not-found__content h1 {
    font-size:
      clamp(52px, 16vw, 90px);
  }
}
</style>