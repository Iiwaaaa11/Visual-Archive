<template>
  <footer class="site-footer page-section">
    <div class="site-footer__top">
      <div>
        <h2>HSWLD</h2>
        <p>Visual Archive</p>
      </div>

      <span>Gallery Indonesia</span>
    </div>

    <div class="site-footer__bottom">
      <span>© {{ new Date().getFullYear() }} HSWLD</span>
      <span>All photographs reserved</span>
    </div>

    <div class="site-footer__links">
      <RouterLink to="/landscape" data-cursor="Open">
        Landscape
      </RouterLink>

      <RouterLink to="/old-archive" data-cursor="Open">
        Old Archive
      </RouterLink>

      <RouterLink to="/about" data-cursor="Open">
        About
      </RouterLink>

      <a
        href="https://www.instagram.com/iiwaaa.__/"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Visit"
      >
        Instagram
      </a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding-top: 100px;
  padding-bottom: 32px;
  background: #050505;
  color: #f2f0ea;
}

.site-footer__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  padding-bottom: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.site-footer__top h2 {
  margin: 0;
  font-size: clamp(42px, 8vw, 120px);
  font-weight: 300;
  line-height: 0.85;
  letter-spacing: -0.07em;
}

.site-footer__top p {
  margin: 18px 0 0;
  color: #777777;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.site-footer__top > span {
  color: #777777;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.site-footer__links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-block: 35px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.site-footer__links a {
  color: #a2a2a2;
  font-size: 11px;
  transition: color 250ms ease;
}

.site-footer__links a:hover {
  color: #ffffff;
}

.site-footer__bottom {
  display: flex;
  justify-content: space-between;
  padding-top: 28px;
  color: #595959;
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@media (max-width: 700px) {
  .site-footer__top {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-footer__links {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .site-footer__bottom {
    flex-direction: column;
    gap: 10px;
  }
}
</style>