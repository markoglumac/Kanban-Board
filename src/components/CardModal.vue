<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <button class="modal__close" @click="$emit('close')">✕</button>

        <!-- Title -->
        <textarea
          v-model="localTitle"
          class="modal__title"
          rows="1"
          @keydown.enter.prevent="saveTitle"
          @blur="saveTitle"
        />

        <!-- Labels -->
        <div class="modal__section">
          <h3 class="modal__label">Labels</h3>
          <div class="modal__labels">
            <span
              v-for="label in localLabels"
              :key="label.id"
              class="modal__tag"
              :style="{ background: label.color }"
            >
              {{ label.text }}
              <button class="modal__tag-remove" @click="removeLabel(label.id)">✕</button>
            </span>
          </div>
          <div class="modal__add-label">
            <input
              v-model="newLabelText"
              class="modal__input"
              placeholder="Label text..."
              @keydown.enter="addLabel"
            />
            <div class="modal__colors">
              <button
                v-for="color in labelColors"
                :key="color"
                class="modal__color-btn"
                :class="{ active: selectedColor === color }"
                :style="{ background: color }"
                @click="selectedColor = color"
              />
            </div>
            <button class="btn btn--primary" @click="addLabel">Add</button>
          </div>
        </div>

        <!-- Description -->
        <div class="modal__section">
          <h3 class="modal__label">Description</h3>
          <textarea
            v-model="localDescription"
            class="modal__textarea"
            rows="5"
            placeholder="Add a description..."
            @blur="saveDescription"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBoardStore } from '@/stores/board'
import type { Card, Label } from '@/types'

const props = defineProps<{
  card: Card
  columnId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useBoardStore()

const localTitle = ref(props.card.title)
const localDescription = ref(props.card.description ?? '')
const localLabels = ref<Label[]>(props.card.labels ? [...props.card.labels] : [])

const newLabelText = ref('')
const selectedColor = ref('#5c6bc0')
const labelColors = ['#5c6bc0', '#43a047', '#e53935', '#fb8c00', '#00acc1', '#8e24aa']

watch(
  () => props.card,
  (card) => {
    localTitle.value = card.title
    localDescription.value = card.description ?? ''
    localLabels.value = card.labels ? [...card.labels] : []
  },
  { deep: true },
)

function saveTitle() {
  const title = localTitle.value.trim()
  if (title) store.updateCard(props.columnId, props.card.id, { title })
}

function saveDescription() {
  store.updateCard(props.columnId, props.card.id, { description: localDescription.value })
}

function addLabel() {
  const text = newLabelText.value.trim()
  if (!text) return
  const label: Label = { id: crypto.randomUUID(), text, color: selectedColor.value }
  localLabels.value.push(label)
  store.updateCard(props.columnId, props.card.id, { labels: localLabels.value })
  newLabelText.value = ''
}

function removeLabel(id: string) {
  localLabels.value = localLabels.value.filter((l) => l.id !== id)
  store.updateCard(props.columnId, props.card.id, { labels: localLabels.value })
}

// close on Esc
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

window.addEventListener('keydown', onKeydown)
import { onUnmounted } from 'vue'
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  @media (max-width: 768px) {
    align-items: flex-end;
  }
}

.modal {
  background: #1e2030;
  border: 1px solid #2e3150;
  border-radius: 14px;
  padding: 32px;
  width: 560px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    max-height: 85vh;
    border-radius: 14px 14px 0 0;
    padding: 24px 20px;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    color: #6b7299;
    cursor: pointer;
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;

    &:hover {
      color: #e0e2f0;
      background: #2a2d3e;
    }
  }

  &__title {
    background: transparent;
    border: none;
    border-bottom: 2px solid #2e3150;
    color: #e0e2f0;
    font-size: 20px;
    font-weight: 700;
    font-family: inherit;
    padding: 4px 0;
    resize: none;
    outline: none;
    width: 100%;

    &:focus {
      border-bottom-color: #5c6bc0;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7299;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0;
  }

  &__labels {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
  }

  &__tag-remove {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 11px;
    padding: 0;
    line-height: 1;

    &:hover {
      color: #fff;
    }
  }

  &__add-label {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__colors {
    display: flex;
    gap: 6px;
  }

  &__color-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;

    &.active {
      border-color: #fff;
    }
  }

  &__input {
    background: #2a2d3e;
    border: 1px solid #3a3d4e;
    border-radius: 8px;
    color: #e0e2f0;
    font-size: 14px;
    font-family: inherit;
    padding: 8px 12px;
    outline: none;
    flex: 1;

    @media (max-width: 768px) {
      width: 100%;
    }

    &:focus {
      border-color: #5c6bc0;
    }
  }

  &__textarea {
    background: #2a2d3e;
    border: 1px solid #3a3d4e;
    border-radius: 8px;
    color: #e0e2f0;
    font-size: 15px;
    font-family: inherit;
    padding: 10px 12px;
    resize: vertical;
    outline: none;

    @media (max-width: 768px) {
      resize: none;
    }

    &:focus {
      border-color: #5c6bc0;
    }
  }
}
</style>
