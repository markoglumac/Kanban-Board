export interface Label {
  id: string
  text: string
  color: string
}

export interface Card {
  id: string
  title: string
  description?: string
  labels?: Label[]
}

export interface Column {
  id: string
  title: string
  cards: Card[]
}

export interface BoardState {
  columns: Column[]
}
