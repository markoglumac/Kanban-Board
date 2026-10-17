<template>
  <article class="kanban-card">
    <div class="kanban-card__drag-handle" title="Drag to move" aria-hidden="true">
      <svg viewBox="0 0 8 14" width="8" height="14">
        <circle cx="2" cy="2" r="1" />
        <circle cx="6" cy="2" r="1" />
        <circle cx="2" cy="7" r="1" />
        <circle cx="6" cy="7" r="1" />
        <circle cx="2" cy="12" r="1" />
        <circle cx="6" cy="12" r="1" />
      </svg>
    </div>

    <div class="kanban-card__body">
      <div v-if="editing" class="kanban-card__edit" @touchstart.stop>
        <textarea
          v-model="editTitle"
          class="field"
          rows="2"
          autofocus
          @keydown.enter.prevent="confirmEdit"
          @keydown.esc="cancelEdit"
        />
        <div class="kanban-card__edit-actions">
          <button class="btn btn--primary" @touchend.prevent="confirmEdit" @click="confirmEdit">
            Save
          </button>
          <button class="btn btn--ghost" @touchend.prevent="cancelEdit" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </div>

      <template v-else>
        <div v-if="card.labels?.length" class="kanban-card__labels">
          <span v-for="label in card.labels" :key="label.id" class="kanban-card__label">
            <i :style="{ background: label.color }" />
            {{ label.text }}
          </span>
        </div>
        <h3 class="kanban-card__heading">
          <span class="kanban-card__title" @click="modalOpen = true">{{ card.title }}</span>
        </h3>
        <span v-if="card.description" class="kanban-card__note">Has notes</span>
      </template>
    </div>

    <div v-if="!editing" class="kanban-card__actions" @mousedown.stop @touchstart.stop>
      <button class="kanban-card__btn" title="Rename" aria-label="Rename card" @click="startEdit">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M11 2.5l2.5 2.5L6 12.5H3.5V10z" />
        </svg>
      </button>
      <button
        class="kanban-card__btn kanban-card__btn--danger"
        title="Delete"
        aria-label="Delete card"
        @click="store.deleteCard(columnId, card.id)"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>

    <CardModal v-if="modalOpen" :card="card" :column-id="columnId" @close="modalOpen = false" />
  </article>
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
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.875rem 0.75rem 0.875rem 0.5rem;
  border: 1px solid $tag;
  border-radius: 0.75rem;
  background: $card;
  color: $ink;
  box-shadow: $shadow;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover,
  &:focus-within {
    transform: translateY(-2px);
    box-shadow: $shadow-hover;
  }

  // placeholder left behind while dragging
  &--ghost {
    opacity: 0.5;
    box-shadow: none;
    border: 1px dashed rgba($main, 0.4);
    background: transparent;
  }

  &__drag-handle {
    flex-shrink: 0;
    padding: 0.25rem;
    border-radius: 0.375rem;
    cursor: grab;
    touch-action: none;
    transition: background-color 0.2s ease;

    svg {
      display: block;
      fill: $ink;
      opacity: 0.35;
      transition: opacity 0.2s ease;
    }

    &:hover {
      background: $tag;

      svg {
        opacity: 0.8;
      }
    }

    &:active {
      cursor: grabbing;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__labels {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-bottom: 0.5rem;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.125rem 0.625rem 0.125rem 0.5rem;
    border-radius: $pill;
    background: $tag;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.5;

    i {
      width: 0.4375rem;
      height: 0.4375rem;
      border-radius: 50%;
      flex-shrink: 0;
    }
  }

  // underline grows on hover, like the portfolio's links
  &__title {
    display: inline;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
    overflow-wrap: anywhere;
    cursor: pointer;
    background-image: linear-gradient($ink, $ink);
    background-position: 0 100%;
    background-repeat: no-repeat;
    background-size: 0% 1px;
    transition: background-size 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);

    &:hover {
      background-size: 100% 1px;
    }
  }

  &__heading {
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
  }

  &__note {
    display: block;
    margin-top: 0.375rem;
    font-size: 0.75rem;
    opacity: 0.55;
  }

  &__actions {
    display: flex;
    gap: 0.125rem;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.2s ease;

    .kanban-card:hover &,
    .kanban-card:focus-within & {
      opacity: 1;
    }

    @media (hover: none) {
      opacity: 1;
    }
  }

  &__btn {
    display: flex;
    padding: 0.3125rem;
    border: none;
    border-radius: $pill;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    svg {
      fill: none;
      stroke: $ink;
      stroke-width: 1.5;
      opacity: 0.6;
    }

    &:hover {
      background: $tag;

      svg {
        opacity: 1;
      }
    }

    &--danger:hover svg {
      stroke: $danger;
    }
  }

  &__edit {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__edit-actions {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
