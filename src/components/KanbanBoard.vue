<template>
  <div class="kanban-board">
    <div class="kanban-board__track">
      <KanbanColumn
        v-for="(column, i) in store.columns"
        :key="column.id"
        :column="column"
        :index="i"
      />

      <div v-if="adding" class="kanban-board__add-form">
        <span class="kanban-board__add-label">New list</span>
        <input
          v-model="newTitle"
          class="field kanban-board__input"
          placeholder="e.g. Backlog"
          autofocus
          @keydown.enter="confirmAdd"
          @keydown.esc="cancelAdd"
        />
        <div class="kanban-board__add-actions">
          <button class="btn btn--primary" @click="confirmAdd">Add list</button>
          <button class="btn btn--ghost" @click="cancelAdd">Cancel</button>
        </div>
      </div>

      <button v-else class="kanban-board__add-btn" @click="adding = true">
        + Add another list
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'
import KanbanColumn from './KanbanColumn.vue'

const store = useBoardStore()

const adding = ref(false)
const newTitle = ref('')

function confirmAdd() {
  const title = newTitle.value.trim()
  if (title) store.addColumn(title)
  cancelAdd()
}

function cancelAdd() {
  adding.value = false
  newTitle.value = ''
}
</script>

<style scoped lang="scss">
.kanban-board {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-color: $line-strong transparent;

  @include screenSize768 {
    scroll-snap-type: x mandatory;
    scroll-padding-inline: $gutter;
  }

  &__track {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    width: max-content;
    // first list lines up with the hero text, the board runs past it on the right
    padding: 0.25rem $gutter 1.5rem max(#{$gutter}, calc((100% - #{$content-width}) / 2));
  }

  &__add-btn {
    width: 272px;
    flex-shrink: 0;
    min-height: 2.75rem;
    padding: 0.875rem 1.125rem;
    border: 1px dashed $line-strong;
    border-radius: $radius-lg;
    background: transparent;
    font-size: 0.9375rem;
    font-weight: 500;
    color: $ink-2;
    text-align: left;
    cursor: pointer;
    transition:
      color 0.2s $ease,
      border-color 0.2s $ease;

    &:hover {
      border-color: $ink;
      color: $ink;
    }
  }

  &__add-form {
    width: 272px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-lg;
    background: $surface;
  }

  &__add-label {
    @include label;
  }

  &__add-actions {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
