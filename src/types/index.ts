export type StickerType =
  | 'normal'
  | 'foil'
  | 'extra'

export interface Sticker {
  id: string
  code: string
  number: number
  country: string
  name: string
  type: 'normal' | 'foil'
}

export type Inventory = Record<string, number>

export type View =
  | 'home'
  | 'packs'
  | 'album'
  | 'missing'
  | 'trade'
  | 'settings'

export interface AlbumStats {
  owned: number
  missing: number
  duplicates: number
  total: number
  completionPct: number
}