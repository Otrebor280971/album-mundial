import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'
import type { Inventory, AlbumStats, View } from '../types'
import { STICKERS } from '../data/stickers'

// Storage seguro: captura errores de cuota (localStorage lleno)
// y advierte en consola sin romper la app ni perder el estado en memoria.
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
      // QuotaExceededError: el storage está lleno.
      // El estado en memoria sigue intacto; solo falla la escritura al disco.
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

// Migración one-shot: mueve datos de la clave anterior ('panini-mundial-2026')
// a la nueva ('album-tracker-26') la primera vez que el usuario abre la app
// con la versión actualizada. Una vez copiados, borra la clave vieja para no
// duplicar el espacio ocupado en localStorage.
const OLD_KEY = 'panini-mundial-2026'
const NEW_KEY = 'album-tracker-26'

function migrateOldKey(): void {
  try {
    const alreadyMigrated = localStorage.getItem(NEW_KEY)
    if (alreadyMigrated) return // la clave nueva ya existe, no hacer nada

    const old = localStorage.getItem(OLD_KEY)
    if (!old) return // tampoco había clave vieja, usuario nuevo

    localStorage.setItem(NEW_KEY, old)
    localStorage.removeItem(OLD_KEY)
    console.info('[album-tracker] Datos migrados de clave anterior correctamente.')
  } catch (err) {
    console.warn('[album-tracker] No se pudo migrar la clave anterior:', err)
  }
}

migrateOldKey()

interface StickerState {
  // ── Data ────────────────────────────────────────────────────────────────
  inventory: Inventory
  recentlyAdded: string[]
  currentView: View

  // ── Navigation ──────────────────────────────────────────────────────────
  setView: (view: View) => void

  // ── Mutations ───────────────────────────────────────────────────────────
  addSticker: (id: string) => void
  removeSticker: (id: string) => void
  tradeSticker: (giveId: string, receiveId: string) => void

  // ── Derived queries ─────────────────────────────────────────────────────
  getMissing: () => typeof STICKERS
  getDuplicates: () => typeof STICKERS
  getStats: () => AlbumStats
}

export const useStickerStore = create<StickerState>()(
  persist(
    (set, get) => ({
      inventory: {},
      recentlyAdded: [],
      currentView: 'home',

      // ── Navigation ──────────────────────────────────────────────────────
      setView(view) {
        set({ currentView: view })
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

      // ── Remove sticker ──────────────────────────────────────────────────
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

      // ── Trade stickers ──────────────────────────────────────────────────
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

          return {
            inventory: updatedInventory,
            recentlyAdded,
          }
        })
      },

      // ── Missing stickers ────────────────────────────────────────────────
      getMissing() {
        const { inventory } = get()

        return STICKERS.filter(
          sticker => (inventory[sticker.id] ?? 0) < 1
        )
      },

      // ── Duplicate stickers ──────────────────────────────────────────────
      getDuplicates() {
        const { inventory } = get()

        return STICKERS.filter(
          sticker => (inventory[sticker.id] ?? 0) > 1
        )
      },

      // ── Album stats ─────────────────────────────────────────────────────
      getStats() {
        const { inventory } = get()

        const owned = STICKERS.filter(
          sticker => (inventory[sticker.id] ?? 0) >= 1
        ).length

        const total = STICKERS.length

        const duplicates = Object.values(inventory).reduce(
          (sum, count) => sum + Math.max(count - 1, 0),
          0
        )

        return {
          owned,
          missing: total - owned,
          duplicates,
          total,
          completionPct:
            total > 0
              ? Math.round((owned / total) * 100)
              : 0,
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
            return JSON.parse(str) as StorageValue<Pick<StickerState, 'inventory' | 'recentlyAdded'>>
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
      version: 1,
      migrate: (persistedState, _version) => {
        // Cualquier versión anterior se conserva tal cual en lugar de borrarse.
        return persistedState as Pick<StickerState, 'inventory' | 'recentlyAdded'>
      },
      partialize: state => ({
        inventory: state.inventory,
        recentlyAdded: state.recentlyAdded,
      }),
    }
  )
)