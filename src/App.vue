<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
  <footer class="footer">
    <span class="footer-label">Marko Glumac</span>
  </footer>
</template>

<style scoped lang="scss">
// also the bottom breathing room below the board
.footer {
  @include container;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 4rem;

  @include screenSize768 {
    height: 3rem;
  }
}

.footer-label {
  @include eyebrow;
  font-size: 0.75rem;
  opacity: 0.55;
}
</style>
