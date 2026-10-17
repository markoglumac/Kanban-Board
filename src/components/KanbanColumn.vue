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
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.125rem;
  border-radius: $radius;
  background: $tag;
  scroll-snap-align: start;

  @include screenSize768 {
    width: 82vw;
  }

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.625rem;
    padding: 0 0.25rem 0.25rem;
  }

  &__number {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    opacity: 0.55;
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    overflow-wrap: anywhere;
  }

  &__count {
    min-width: 1.5rem;
    padding: 0.125rem 0.5rem;
    border-radius: $pill;
    background: $tag;
    font-size: 0.8125rem;
    font-weight: 500;
    text-align: center;
  }

  &__delete {
    align-self: center;
    display: flex;
    padding: 0.25rem;
    border: none;
    border-radius: $pill;
    background: none;
    cursor: pointer;
    opacity: 0;
    transition:
      opacity 0.2s ease,
      background-color 0.2s ease;

    svg {
      fill: none;
      stroke: $ink;
      stroke-width: 1.5;
    }

    .kanban-column:hover &,
    &:focus-visible {
      opacity: 0.6;
    }

    &:hover {
      opacity: 1 !important;
      background: $tag;

      svg {
        stroke: $danger;
      }
    }

    @media (hover: none) {
      opacity: 0.6;
    }
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    min-height: 80px;
  }

  &__add-btn {
    padding: 0.625rem 0.75rem;
    border: none;
    border-radius: 0.75rem;
    background: none;
    font-weight: 500;
    color: $ink;
    text-align: left;
    opacity: 0.65;
    cursor: pointer;
    transition:
      opacity 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      opacity: 1;
      background: $tag;
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
