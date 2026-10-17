<template>
  <main class="home">
    <section class="hero">
      <p class="eyebrow">Kanban board · {{ today }}</p>
      <h1 class="title">Plan it. Do it.</h1>
      <p class="lead">Keep track of what's next, what's in motion and what's done.</p>
    </section>

    <section class="board-section skin--light">
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
// lets the board section stretch down to the page-end spacer
.home {
  display: flex;
  flex-direction: column;
}

.hero {
  @include container;
  padding: 5.5rem 0 4.5rem;

  @include screenSize768 {
    padding: 3.5rem 0 3rem;
  }
}

.eyebrow {
  @include eyebrow;
}

.title {
  margin-top: 1rem;
  font-size: clamp(2.75rem, 8vw, 5.5rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.03em;
}

.lead {
  margin-top: 1.5rem;
  font-size: clamp(1.25rem, 2.8vw, 1.75rem);
  font-weight: 300;
  line-height: 1.25;
  text-wrap: balance;
}

.board-section {
  flex: 1;
  padding: 4rem 0 4.5rem;
  border-radius: $radius-section 0 $radius-section 0;

  @include screenSize768 {
    padding: 2.5rem 0 3rem;
    border-radius: 2rem 0 2rem 0;
  }
}
</style>
