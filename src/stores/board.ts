import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Card, Column } from '@/types'

const STORAGE_KEY = 'kanban-board'

const defaultColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: crypto.randomUUID(), title: 'Set up project' },
      { id: crypto.randomUUID(), title: 'Design the UI' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [{ id: crypto.randomUUID(), title: 'Build Kanban board' }],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [],
  },
]

function loadFromStorage(): Column[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultColumns
  } catch {
    return defaultColumns
  }
}

export const useBoardStore = defineStore('board', () => {
  const columns = ref<Column[]>(loadFromStorage())

  watch(columns, (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true })

  function addCard(columnId: string, title: string) {
    const col = columns.value.find((c) => c.id === columnId)
    if (col) {
      col.cards.push({ id: crypto.randomUUID(), title })
    }
  }

  function deleteCard(columnId: string, cardId: string) {
    const col = columns.value.find((c) => c.id === columnId)
    if (col) col.cards = col.cards.filter((c) => c.id !== cardId)
  }

  function updateCard(columnId: string, cardId: string, patch: Partial<Omit<Card, 'id'>>) {
    const col = columns.value.find((c) => c.id === columnId)
    if (col) {
      const card = col.cards.find((c) => c.id === cardId)
      if (card) Object.assign(card, patch)
    }
  }

  function addColumn(title: string) {
    columns.value.push({
      id: crypto.randomUUID(),
      title,
      cards: [],
    })
  }

  function deleteColumn(columnId: string) {
    columns.value = columns.value.filter((c) => c.id !== columnId)
  }

  return { columns, addCard, deleteCard, updateCard, addColumn, deleteColumn }
})
