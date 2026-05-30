import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'
import type { Inventory, AlbumStats, View } from '../types'
import { STICKERS, STICKERS_CC_MEX, STICKERS_CC_USA } from '../data/stickers'

// ── Versiones disponibles ────────────────────────────────────────────────────
export type AlbumVersion = 'MEX' | 'USA'

export const ALBUM_VERSIONS: Record<AlbumVersion, { ccStickers: typeof STICKERS }> = {
  MEX: { ccStickers: STICKERS_CC_MEX },
  USA: { ccStickers: STICKERS_CC_USA },
}

function getFullStickers(version: AlbumVersion | null) {
  if (!version) return STICKERS
  return [...STICKERS, ...ALBUM_VERSIONS[version].ccStickers]
}

// ── Safe storage ─────────────────────────────────────────────────────────────
const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn('[album-tracker] No se pudo leer localStorage:', name)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (err) {
      console.warn('[album-tracker] localStorage lleno, no se pudo guardar:', err)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn('[album-tracker] No se pudo eliminar de localStorage:', name)
    }
  },
}

// ── Migración de clave anterior ───────────────────────────────────────────────
const OLD_KEY = 'panini-mundial-2026'
const NEW_KEY = 'album-tracker-26'

function migrateOldKey(): void {
  try {
    const alreadyMigrated = localStorage.getItem(NEW_KEY)
    if (alreadyMigrated) return

    const old = localStorage.getItem(OLD_KEY)
    if (!old) return

    localStorage.setItem(NEW_KEY, old)
    localStorage.removeItem(OLD_KEY)
    console.info('[album-tracker] Datos migrados de clave anterior correctamente.')
  } catch (err) {
    console.warn('[album-tracker] No se pudo migrar la clave anterior:', err)
  }
}

migrateOldKey()

// ── Types ─────────────────────────────────────────────────────────────────────
interface StickerState {
  // ── Data ──────────────────────────────────────────────────────────────────
  inventory: Inventory
  recentlyAdded: string[]
  currentView: View
  albumVersion: AlbumVersion | null

  // ── Navigation ────────────────────────────────────────────────────────────
  setView: (view: View) => void

  // ── Setup ─────────────────────────────────────────────────────────────────
  setAlbumVersion: (version: AlbumVersion) => void

  // ── Mutations ─────────────────────────────────────────────────────────────
  addSticker: (id: string) => void
  removeSticker: (id: string) => void
  tradeSticker: (giveId: string, receiveId: string) => void

  // ── Derived queries ───────────────────────────────────────────────────────
  getMissing: () => typeof STICKERS
  getDuplicates: () => typeof STICKERS
  getStats: () => AlbumStats
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useStickerStore = create<StickerState>()(
  persist(
    (set, get) => ({
      inventory: {},
      recentlyAdded: [],
      currentView: 'home',
      albumVersion: null,

      // ── Navigation ──────────────────────────────────────────────────────
      setView(view) {
        set({ currentView: view })
      },

      // ── Setup ───────────────────────────────────────────────────────────
      setAlbumVersion(version) {
        set({ albumVersion: version })
      },

      // ── Add sticker ─────────────────────────────────────────────────────
      addSticker(id) {
        set(state => {
          const inventory = {
            ...state.inventory,
            [id]: (state.inventory[id] ?? 0) + 1,
          }

          const recentlyAdded = [
            id,
            ...state.recentlyAdded.filter(r => r !== id),
          ].slice(0, 5)

          return { inventory, recentlyAdded }
        })
      },

      // ── Remove sticker ───────────────────────────────────────────────────
      removeSticker(id) {
        set(state => {
          const current = state.inventory[id] ?? 0
          if (current <= 0) return state

          const inventory = { ...state.inventory }
          if (current === 1) {
            delete inventory[id]
          } else {
            inventory[id] = current - 1
          }

          return {
            inventory,
            recentlyAdded: state.recentlyAdded.filter(r => r !== id),
          }
        })
      },

      // ── Trade stickers ───────────────────────────────────────────────────
      tradeSticker(giveId, receiveId) {
        const inventory = get().inventory
        if ((inventory[giveId] ?? 0) <= 1) return

        get().removeSticker(giveId)

        set(state => {
          const updatedInventory = {
            ...state.inventory,
            [receiveId]: (state.inventory[receiveId] ?? 0) + 1,
          }

          const recentlyAdded = [
            receiveId,
            ...state.recentlyAdded.filter(r => r !== receiveId),
          ].slice(0, 5)

          return { inventory: updatedInventory, recentlyAdded }
        })
      },

      // ── Missing stickers ─────────────────────────────────────────────────
      getMissing() {
        const { inventory, albumVersion } = get()
        return getFullStickers(albumVersion).filter(
          s => (inventory[s.id] ?? 0) < 1
        )
      },

      // ── Duplicate stickers ───────────────────────────────────────────────
      getDuplicates() {
        const { inventory, albumVersion } = get()
        return getFullStickers(albumVersion).filter(
          s => (inventory[s.id] ?? 0) > 1
        )
      },

      // ── Album stats ──────────────────────────────────────────────────────
      getStats() {
        const { inventory, albumVersion } = get()
        const allStickers = getFullStickers(albumVersion)

        const owned = allStickers.filter(
          s => (inventory[s.id] ?? 0) >= 1
        ).length

        const total = allStickers.length

        const duplicates = Object.values(inventory).reduce(
          (sum, count) => sum + Math.max(count - 1, 0),
          0
        )

        return {
          owned,
          missing: total - owned,
          duplicates,
          total,
          completionPct: total > 0 ? Math.round((owned / total) * 100) : 0,
        }
      },
    }),
    {
      name: 'album-tracker-26',
      storage: {
        getItem: (name) => {
          const str = safeStorage.getItem(name)
          if (!str) return null

          try {
            return JSON.parse(str) as StorageValue<unknown>
          } catch {
            console.warn('[album-tracker] Estado corrupto en localStorage, se ignora.')
            return null
          }
        },

        setItem: (name, value) => {
          safeStorage.setItem(name, JSON.stringify(value))
        },

        removeItem: (name) => {
          safeStorage.removeItem(name)
        },
      },

      version: 2,

      migrate: (
        persistedState: unknown,
        version: number
      ) => {
        const state = persistedState as any

        if (version < 2) {
          state.albumVersion = 'MEX'
        }

        return state
      },

      partialize: (
        state
      ): {
        inventory: Inventory
        recentlyAdded: string[]
        albumVersion: AlbumVersion | null
      } => ({
        inventory: state.inventory,
        recentlyAdded: state.recentlyAdded,
        albumVersion: state.albumVersion,
      }),
    }
  )
)