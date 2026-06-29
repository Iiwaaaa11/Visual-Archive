<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="about-page">
    <AppHeader />

    <main class="about-page__content">
      <span class="section-label">About the archive</span>

      <h1>
        Photographs collected from journeys, quiet places, and fragments of
        memory.
      </h1>

      <div class="about-page__details">
        <p>
          HSWLD is a personal visual archive by Husni Walad. The archive
          is divided into Landscape and Old Archive.
        </p>

        <p>
          Landscape records nature, distant places, changing light, mountains,
          roads, and quiet environments.
        </p>

        <p>
          Old Archive preserves monochrome photographs through grain, dust,
          noise, and imperfect textures.
        </p>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.about-page {
  background: #e7e5df;
  color: #111111;
}

.about-page__content {
  min-height: 100vh;
  padding: 170px var(--page-padding) 140px;
}

.about-page__content h1 {
  max-width: 1150px;
  margin: 30px 0 130px;
  font-size: clamp(48px, 7vw, 108px);
  font-weight: 300;
  line-height: 0.95;
  letter-spacing: -0.065em;
}

.about-page__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  padding-top: 35px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}

.about-page__details p {
  margin: 0;
  color: #555555;
  font-size: 12px;
  line-height: 1.85;
}

@media (max-width: 800px) {
  .about-page__content {
    padding-top: 130px;
  }

  .about-page__content h1 {
    margin-bottom: 80px;
  }

  .about-page__details {
    grid-template-columns: 1fr;
  }
}
</style>