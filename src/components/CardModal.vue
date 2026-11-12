<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal__top">
          <span class="modal__eyebrow">Card details</span>
          <button class="modal__close" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <!-- Title -->
        <textarea
          v-model="localTitle"
          class="modal__title"
          rows="2"
          @keydown.enter.prevent="saveTitle"
          @blur="saveTitle"
        />

        <!-- Labels -->
        <div class="modal__section">
          <h3 class="modal__label">Labels</h3>
          <div v-if="localLabels.length" class="modal__labels">
            <span v-for="label in localLabels" :key="label.id" class="modal__tag">
              <i :style="{ background: label.color }" />
              {{ label.text }}
              <button
                class="modal__tag-remove"
                :aria-label="`Remove label ${label.text}`"
                @click="removeLabel(label.id)"
              >
                ✕
              </button>
            </span>
          </div>
          <div class="modal__add-label">
            <input
              v-model="newLabelText"
              class="field modal__input"
              placeholder="New label"
              @keydown.enter="addLabel"
            />
            <div class="modal__colors">
              <button
                v-for="color in labelColors"
                :key="color"
                class="modal__color-btn"
                :class="{ active: selectedColor === color }"
                :style="{ background: color }"
                :aria-label="`Label colour ${color}`"
                :aria-pressed="selectedColor === color"
                @click="selectedColor = color"
              />
            </div>
            <button class="btn btn--primary" @click="addLabel">Add</button>
          </div>
        </div>

        <!-- Description -->
        <div class="modal__section">
          <h3 class="modal__label">Notes</h3>
          <textarea
            v-model="localDescription"
            class="field modal__textarea"
            rows="6"
            placeholder="Write something down…"
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
// tones picked to read on the near-black palette; first is the portfolio accent
const labelColors = ['#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#fbbf24', '#a3a3a3']
const selectedColor = ref('#34d399')

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
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $gutter;
  background: color-mix(in srgb, $bg 78%, transparent);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  @include screenSize768 {
    align-items: flex-end;
    padding: 0;
  }
}

.modal {
  position: relative;
  width: 600px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 1.5rem 1.75rem 1.75rem;
  border: 1px solid $line;
  border-radius: $radius-lg;
  background: $surface;
  color: $ink;

  @include screenSize768 {
    max-height: 88vh;
    padding: 1.25rem $gutter 1.75rem;
    border-radius: $radius-lg $radius-lg 0 0;
    border-bottom: 0;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__eyebrow {
    @include label;
  }

  &__close {
    display: flex;
    padding: 0.5rem;
    border: 1px solid $line-strong;
    border-radius: $radius;
    background: transparent;
    cursor: pointer;
    transition: border-color 0.2s $ease;

    svg {
      fill: none;
      stroke: $ink;
      stroke-width: 1.5;
    }

    &:hover {
      border-color: $ink;
    }
  }

  &__title {
    width: 100%;
    margin-top: -0.75rem;
    padding: 0;
    border: none;
    background: transparent;
    font-size: clamp(1.5rem, 3.4vw, 2rem);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: $ink;
    resize: none;
    outline: none;
    field-sizing: content;
    overflow: hidden;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 1.25rem;
    border-top: 1px solid $line;
  }

  &__label {
    @include label;
  }

  &__labels {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.25rem 0.25rem 0.625rem;
    border: 1px solid $line;
    border-radius: 4px;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.4;
    color: $ink-2;

    i {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }
  }

  &__tag-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: none;
    border-radius: 3px;
    background: none;
    font-size: 0.625rem;
    color: $muted;
    cursor: pointer;
    transition: color 0.2s $ease;

    &:hover {
      color: $danger;
    }
  }

  &__add-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;

    @include screenSize480 {
      align-items: stretch;
      flex-direction: column;
    }
  }

  &__input {
    flex: 1;
    min-width: 160px;
    min-height: 2.5rem;
    padding-block: 0.5rem;
  }

  &__colors {
    display: flex;
    gap: 0.375rem;
  }

  &__color-btn {
    width: 1.375rem;
    height: 1.375rem;
    padding: 0;
    border: 2px solid $surface;
    border-radius: 50%;
    box-shadow: 0 0 0 1px $line;
    cursor: pointer;
    transition: box-shadow 0.2s $ease;

    &:hover {
      box-shadow: 0 0 0 1px $line-strong;
    }

    &.active {
      box-shadow: 0 0 0 2px $ink;
    }
  }

  &__textarea {
    line-height: 1.6;
    resize: vertical;

    @include screenSize768 {
      resize: none;
    }
  }
}
</style>
