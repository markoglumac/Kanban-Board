<script setup lang="ts">
import { RouterView } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <span class="site-header__logo">Marko Glumac</span>
      <span class="site-header__meta">Kanban board</span>
    </div>
  </header>
  <RouterView />
  <footer class="site-footer">
    <div class="site-footer__inner">© {{ year }} Marko Glumac</div>
  </footer>
</template>

<style scoped lang="scss">
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid $line;
  background-color: color-mix(in srgb, $bg 82%, transparent);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  backdrop-filter: saturate(180%) blur(12px);

  &__inner {
    @include container;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 3.75rem;
  }

  &__logo {
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &__meta {
    font-size: 0.875rem;
    color: $ink-2;
  }
}

.site-footer {
  border-top: 1px solid $line;

  &__inner {
    @include container;
    padding-block: 1.75rem;
    font-size: 0.75rem;
    color: $muted;
    text-align: center;
  }
}
</style>
