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
  scrollbar-color: $line-light transparent;

  @include screenSize768 {
    scroll-snap-type: x mandatory;
    scroll-padding-inline: $gutter;
  }

  &__track {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    width: max-content;
    // first list lines up with the hero text, the board runs past it on the right
    padding: 0.5rem $gutter 1.5rem max(#{$gutter}, calc((100% - #{$content-width}) / 2));
  }

  &__add-btn {
    width: 260px;
    flex-shrink: 0;
    padding: 1.125rem 1.25rem;
    border: 1px dashed rgba($main, 0.3);
    border-radius: $radius;
    background: transparent;
    font-weight: 500;
    color: $ink;
    text-align: left;
    opacity: 0.7;
    cursor: pointer;
    transition:
      opacity 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      opacity: 1;
      border-color: $main;
      background: $tag;
    }
  }

  &__add-form {
    width: 260px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.125rem;
    border-radius: $radius;
    background: $tag;
  }

  &__add-label {
    @include eyebrow;
    font-size: 0.75rem;
  }

  &__add-actions {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
