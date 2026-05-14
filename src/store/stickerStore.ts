import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Inventory, AlbumStats, View } from '../types'
import { STICKERS } from '../data/stickers'

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
  resetCollection: () => void

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

        // No permitir intercambiar si solo tienes 1
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

      // ── Reset ───────────────────────────────────────────────────────────
      resetCollection() {
        set({
          inventory: {},
          recentlyAdded: [],
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

        // Cuenta sobrantes reales
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
      name: 'panini-mundial-2026',

      partialize: state => ({
        inventory: state.inventory,
        recentlyAdded: state.recentlyAdded,
      }),
    }
  )
)