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
      <button class="kanban-card__btn mobile-only" title="Move" @click="movePicker = true">
        ↗️
      </button>
      <button class="kanban-card__btn" title="Delete" @click="store.deleteCard(columnId, card.id)">
        🗑️
      </button>
    </div>

    <!-- Move picker -->
    <Teleport to="body">
      <div v-if="movePicker" class="move-backdrop" @click.self="movePicker = false">
        <div class="move-picker">
          <h3 class="move-picker__title">Move to...</h3>
          <button
            v-for="col in otherColumns"
            :key="col.id"
            class="move-picker__option"
            @click="moveTo(col.id)"
          >
            {{ col.title }}
          </button>
          <button class="move-picker__cancel" @click="movePicker = false">Cancel</button>
        </div>
      </div>
    </Teleport>

    <CardModal v-if="modalOpen" :card="card" :column-id="columnId" @close="modalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBoardStore } from '@/stores/board'
import CardModal from './CardModal.vue'
import type { Card } from '@/types'

const props = defineProps<{
  card: Card
  columnId: string
}>()

const store = useBoardStore()
const modalOpen = ref(false)
const movePicker = ref(false)

const editing = ref(false)
const editTitle = ref('')

const otherColumns = computed(() => store.columns.filter((c) => c.id !== props.columnId))

function moveTo(targetColumnId: string) {
  store.deleteCard(props.columnId, props.card.id)
  const col = store.columns.find((c) => c.id === targetColumnId)
  if (col) col.cards.push(props.card)
  movePicker.value = false
}

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

.mobile-only {
  display: none;

  @media (max-width: 768px) {
    display: inline-flex;
  }
}

.move-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
}

.move-picker {
  background: #1e2030;
  border: 1px solid #2e3150;
  border-radius: 14px 14px 0 0;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: #6b7299;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 4px;
  }

  &__option {
    background: #2a2d3e;
    border: 1px solid #3a3d4e;
    border-radius: 8px;
    color: #e0e2f0;
    cursor: pointer;
    font-size: 15px;
    font-family: inherit;
    padding: 12px 16px;
    text-align: left;
    transition: background 0.2s;

    &:hover {
      background: #313447;
    }
  }

  &__cancel {
    background: transparent;
    border: none;
    color: #6b7299;
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;
    padding: 8px;
    text-align: center;
    transition: color 0.2s;

    &:hover {
      color: #a0a8d0;
    }
  }
}
</style>
