<template>
  <section class="kanban-column">
    <header class="kanban-column__header">
      <span class="kanban-column__number">{{ number }}</span>
      <h2 class="kanban-column__title">{{ column.title }}</h2>
      <span class="kanban-column__count">{{ cards.length }}</span>
      <button
        class="kanban-column__delete"
        title="Delete list"
        aria-label="Delete list"
        @click="store.deleteColumn(column.id)"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </header>

    <VueDraggable
      v-model="cards"
      group="cards"
      class="kanban-column__cards"
      ghost-class="kanban-card--ghost"
      :filter="'.kanban-card__actions'"
      :prevent-on-filter="true"
      handle=".kanban-card__drag-handle"
    >
      <KanbanCard v-for="card in cards" :key="card.id" :card="card" :column-id="column.id" />
    </VueDraggable>

    <div v-if="adding" class="kanban-column__add-form">
      <textarea
        v-model="newTitle"
        class="field"
        placeholder="What needs doing?"
        rows="2"
        autofocus
        @keydown.enter.prevent="confirmAdd"
        @keydown.esc="cancelAdd"
      />
      <div class="kanban-column__add-actions">
        <button class="btn btn--primary" @click="confirmAdd">Add card</button>
        <button class="btn btn--ghost" @click="cancelAdd">Cancel</button>
      </div>
    </div>

    <button v-else class="kanban-column__add-btn" @click="adding = true">+ Add a card</button>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import KanbanCard from './KanbanCard.vue'
import { useBoardStore } from '@/stores/board'
import type { Column } from '@/types'

const props = defineProps<{
  column: Column
  index: number
}>()

const store = useBoardStore()

const number = computed(() => String(props.index + 1).padStart(2, '0'))

const cards = computed({
  get: () => props.column.cards,
  set: (val) => {
    const col = store.columns.find((c) => c.id === props.column.id)
    if (col) col.cards = val
  },
})

const adding = ref(false)
const newTitle = ref('')

function confirmAdd() {
  const title = newTitle.value.trim()
  if (title) store.addCard(props.column.id, title)
  cancelAdd()
}

function cancelAdd() {
  adding.value = false
  newTitle.value = ''
}
</script>

<style scoped lang="scss">
.kanban-column {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid $line;
  border-radius: $radius-lg;
  background: $surface;
  scroll-snap-align: start;

  @include screenSize768 {
    width: 82vw;
  }

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.625rem;
    padding: 0 0.125rem 0.75rem;
    border-bottom: 1px solid $line;
  }

  &__number {
    @include label;
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-size: 1.0625rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.015em;
    overflow-wrap: anywhere;
  }

  &__count {
    min-width: 1.5rem;
    padding: 0.125rem 0.4375rem;
    border: 1px solid $line;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.4;
    color: $ink-2;
    text-align: center;
  }

  &__delete {
    align-self: center;
    display: flex;
    padding: 0.25rem;
    border: none;
    border-radius: 4px;
    background: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s $ease;

    svg {
      fill: none;
      stroke: $muted;
      stroke-width: 1.5;
      transition: stroke 0.2s $ease;
    }

    .kanban-column:hover &,
    &:focus-visible {
      opacity: 1;
    }

    &:hover svg {
      stroke: $danger;
    }

    @media (hover: none) {
      opacity: 1;
    }
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 80px;
  }

  &__add-btn {
    min-height: 2.5rem;
    padding: 0.5rem 0.625rem;
    border: none;
    border-radius: $radius;
    background: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: $ink-2;
    text-align: left;
    cursor: pointer;
    transition:
      color 0.2s $ease,
      background-color 0.2s $ease;

    &:hover {
      color: $ink;
      background: $raised;
    }
  }

  &__add-form {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__add-actions {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
