<template>
  <div class="kanban-board">
    <KanbanColumn v-for="column in store.columns" :key="column.id" :column="column" />

    <div v-if="adding" class="kanban-board__add-form">
      <input
        v-model="newTitle"
        class="kanban-board__input"
        placeholder="Column title..."
        @keydown.enter="confirmAdd"
        @keydown.esc="cancelAdd"
      />
      <div class="kanban-board__add-actions">
        <button class="btn btn--primary" @click="confirmAdd">Add</button>
        <button class="btn btn--ghost" @click="cancelAdd">Cancel</button>
      </div>
    </div>

    <button v-else class="kanban-board__add-btn" @click="adding = true">+ Add column</button>
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
  display: flex;
  gap: 24px;
  padding: 40px;
  align-items: flex-start;
  min-height: 100vh;
  background: #13152a;

  &__add-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px dashed #2e3150;
    border-radius: 12px;
    color: #6b7299;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 16px 24px;
    width: 300px;
    text-align: left;
    transition:
      background 0.2s,
      color 0.2s;
    flex-shrink: 0;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #a0a8d0;
    }
  }

  &__add-form {
    background: #1e2030;
    border: 1px solid #2e3150;
    border-radius: 12px;
    padding: 20px;
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__input {
    background: #2a2d3e;
    border: 1px solid #3a3d4e;
    border-radius: 8px;
    color: #e0e2f0;
    font-size: 15px;
    font-family: inherit;
    padding: 10px 12px;
    outline: none;

    &:focus {
      border-color: #5c6bc0;
    }
  }

  &__add-actions {
    display: flex;
    gap: 8px;
  }

  // mobile
  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
