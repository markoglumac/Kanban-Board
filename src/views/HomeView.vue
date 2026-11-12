<template>
  <main class="home">
    <section class="hero">
      <p class="status"><span class="status__dot" aria-hidden="true" />{{ today }}</p>
      <h1 class="title">Plan it. Do it.</h1>
      <p class="lead">Keep track of what's next, what's in motion and what's done.</p>
    </section>

    <section class="board-section" aria-label="Board">
      <KanbanBoard />
    </section>
  </main>
</template>

<script setup lang="ts">
import KanbanBoard from '@/components/KanbanBoard.vue'

const today = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
</script>

<style scoped lang="scss">
// lets the board section stretch down to the footer
.home {
  display: flex;
  flex-direction: column;
}

.hero {
  @include container;
  padding-block: clamp(4rem, 10vw, 7rem) clamp(3rem, 6vw, 4.5rem);
}

.status {
  @include label;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  color: $ink-2;

  &__dot {
    position: relative;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: $accent;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: $accent;
      // 2 × 2.4s: stops before 5s, so no pause control is needed (WCAG 2.2.2)
      animation: pulse 2.4s $ease 2;
    }
  }
}

.title {
  max-width: 18ch;
  margin-top: 1.75rem;
  font-size: clamp(2.375rem, 6.4vw, 4.75rem);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.lead {
  max-width: 52ch;
  margin-top: 1.75rem;
  font-size: clamp(1.0625rem, 1.6vw, 1.25rem);
  line-height: 1.55;
  color: $ink-2;
  text-wrap: pretty;
}

.board-section {
  flex: 1;
  padding-block: clamp(2.5rem, 5vw, 3.5rem) clamp(3rem, 6vw, 4.5rem);
  border-top: 1px solid $line;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70%,
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}
</style>
