<template>
  <div class="kanban-card">
    <textarea
      v-if="editing"
      v-model="editTitle"
      class="kanban-card__textarea"
      rows="2"
      @keydown.enter.prevent="confirmEdit"
      @keydown.esc="cancelEdit"
      @blur="confirmEdit"
    />
    <span v-else class="kanban-card__title" @click="modalOpen = true">{{ card.title }}</span>

    <div class="kanban-card__actions">
      <button class="kanban-card__btn" title="Edit" @click="startEdit">✏️</button>
      <button class="kanban-card__btn" title="Delete" @click="store.deleteCard(columnId, card.id)">
        🗑️
      </button>
    </div>

    <CardModal v-if="modalOpen" :card="card" :column-id="columnId" @close="modalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'
import CardModal from './CardModal.vue'
import type { Card } from '@/types'

const props = defineProps<{
  card: Card
  columnId: string
}>()

const store = useBoardStore()
const modalOpen = ref(false)

const editing = ref(false)
const editTitle = ref('')

function startEdit() {
  editTitle.value = props.card.title
  editing.value = true
}

function confirmEdit() {
  const title = editTitle.value.trim()
  if (title) store.updateCard(props.columnId, props.card.id, { title })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<style scoped lang="scss">
.kanban-card {
  background: #2a2d3e;
  border: 1px solid #3a3d4e;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  color: #e0e2f0;
  cursor: grab;
  transition:
    background 0.2s,
    box-shadow 0.2s;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;

  &:hover {
    background: #313447;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

    .kanban-card__actions {
      opacity: 1;
    }
  }

  &:active {
    cursor: grabbing;
  }

  &__title {
    flex: 1;
    line-height: 1.4;
  }

  &__textarea {
    flex: 1;
    background: #1e2030;
    border: 1px solid #5c6bc0;
    border-radius: 6px;
    color: #e0e2f0;
    font-size: 15px;
    font-family: inherit;
    padding: 6px 8px;
    resize: none;
    outline: none;
  }

  &__actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  &__btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 13px;
    padding: 2px 4px;
    border-radius: 4px;
    line-height: 1;

    &:hover {
      background: #3a3d4e;
    }
  }
}
</style>
