<template>
  <div class="kanban-column">
    <div class="kanban-column__header">
      <h2 class="kanban-column__title">{{ column.title }}</h2>
      <button
        class="kanban-column__delete"
        title="Delete column"
        @click="store.deleteColumn(column.id)"
      >
        ✕
      </button>
    </div>

    <VueDraggable v-model="cards" group="cards" class="kanban-column__cards">
      <KanbanCard v-for="card in cards" :key="card.id" :card="card" :column-id="column.id" />
    </VueDraggable>

    <div v-if="adding" class="kanban-column__add-form">
      <textarea
        v-model="newTitle"
        class="kanban-column__textarea"
        placeholder="Card title..."
        rows="2"
        @keydown.enter.prevent="confirmAdd"
        @keydown.esc="cancelAdd"
      />
      <div class="kanban-column__add-actions">
        <button class="btn btn--primary" @click="confirmAdd">Add</button>
        <button class="btn btn--ghost" @click="cancelAdd">Cancel</button>
      </div>
    </div>

    <button v-else class="kanban-column__add-btn" @click="adding = true">+ Add a card</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import KanbanCard from './KanbanCard.vue'
import { useBoardStore } from '@/stores/board'
import type { Column } from '@/types'

const props = defineProps<{
  column: Column
}>()

const store = useBoardStore()

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
  background: #1e2030;
  border: 1px solid #2e3150;
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 10px;
    color: #a0a8d0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    min-height: 60px;
  }

  &__add-btn {
    background: transparent;
    border: none;
    color: #6b7299;
    font-size: 14px;
    padding: 8px 4px;
    cursor: pointer;
    text-align: left;
    transition: color 0.2s;

    &:hover {
      color: #a0a8d0;
    }
  }

  &__add-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__textarea {
    background: #2a2d3e;
    border: 1px solid #3a3d4e;
    border-radius: 8px;
    color: #e0e2f0;
    font-size: 15px;
    padding: 10px 12px;
    resize: none;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: #5c6bc0;
    }
  }

  &__add-actions {
    display: flex;
    gap: 8px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    color: #a0a8d0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__delete {
    background: transparent;
    border: none;
    color: #6b7299;
    cursor: pointer;
    font-size: 14px;
    padding: 4px 6px;
    border-radius: 4px;
    line-height: 1;
    transition:
      color 0.2s,
      background 0.2s;

    &:hover {
      color: #e06c75;
      background: #2a2d3e;
    }
  }
}
</style>
