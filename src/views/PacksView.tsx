import { useRef, useState, useEffect } from 'react'
import { useStickerStore } from '../store/stickerStore'
import { useFuseSearch } from '../hooks/useFuseSearch'
import { useToast } from '../hooks/useToast'
import { parseBulkInput } from '../utils/parseBulk'
import { STICKERS } from '../data/stickers'
import { PackageX, Undo2 } from 'lucide-react'

export function PacksView() {
  const { query, setQuery, results, clear } = useFuseSearch()
  const { toast } = useToast()
  const addSticker = useStickerStore(s => s.addSticker)
  const removeSticker = useStickerStore(s => s.removeSticker)
  const inventory = useStickerStore(s => s.inventory)
  const recentlyAdded = useStickerStore(s => s.recentlyAdded)

  const [bulk, setBulk] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mantener focus en input al montar
  useEffect(() => { inputRef.current?.focus() }, [])

  function quickAdd(id: string) {
    addSticker(id)
    clear()
    inputRef.current?.focus()
    toast(`✓ ${id} agregada`)
  }

  function undoAdd(id: string) {
    removeSticker(id)
    toast(`Deshecho: ${id}`)
  }

  function handleBulkAdd() {
    const { valid, invalid } = parseBulkInput(bulk)
    valid.forEach(id => addSticker(id))
    setBulk('')
    if (invalid.length) toast(`${valid.length} agregadas, ${invalid.length} no encontradas`)
    else toast(`✓ ${valid.length} estampas agregadas`)
  }

  const showDropdown = query.trim().length > 0 && results.length > 0

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">Abrir sobres</h1>
      <p className="text-sm text-neutral-400 mb-4">Busca y agrega estampas</p>

      {/* Search */}
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && clear()}
          placeholder="Buscar por código o nombre (ej. MEX17, messi...)"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          className="text-black w-full px-4 py-3 rounded-xl border border-neutral-800 bg-[#111111]text-neutral-100 placeholder:text-neutral-500 text-sm outline-none focus:border-brand-400 transition-colors"
        />

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-[#111111] border-neutral-800 rounded-xl overflow-hidden shadow-lg z-10 max-h-56 overflow-y-auto"
          >
            {results.map(sticker => {
              const cnt = inventory[sticker.id] ?? 0
              return (
                <button
                  key={sticker.id}
                  onClick={() => quickAdd(sticker.id)}
                  className="w-full px-4 py-3 flex items-center justify-between border-b border-black/5 dark:border-white/5 last:border-0 active:bg-neutral-50 dark:active:bg-neutral-800 text-left cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-brand-400 block">{sticker.id}</span>
                    <span className="text-sm text-neutral-800 dark:text-neutral-100">
                      {sticker.type === 'foil' && '⭐ '}{sticker.name}
                    </span>
                    <span className="text-xs text-neutral-400 block">{sticker.country}</span>
                  </div>
                  {cnt > 0
                    ? <span className="text-xs bg-brand-50 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 px-2 py-1 rounded-full font-medium">×{cnt}</span>
                    : <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">Falta</span>
                  }
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Recently added */}
      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-2.5">Últimas agregadas</p>
      {recentlyAdded.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 text-sm">
          <PackageX size={36} className="mx-auto mb-2" />
          Aún no has agregado estampas
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {recentlyAdded.map(id => {
            const sticker = STICKERS.find(s => s.id === id)
            const cnt = inventory[id] ?? 0
            return (
              <div key={id} className="bg-white dark:bg-neutral-900 rounded-xl border border-black/5 dark:border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-400">{id}</span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">{sticker?.name ?? '?'}</span>
                  {cnt > 1 && <span className="text-xs text-amber-500">×{cnt}</span>}
                </div>
                <button
                  onClick={() => undoAdd(id)}
                  className="text-xs text-blue-500 px-2 py-1"
                  aria-label={`Deshacer ${id}`}
                >
                  <Undo2 size={16} /> Deshacer
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Bulk add */}
      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-2.5">Pegado masivo</p>
      <textarea
        value={bulk}
        onChange={e => setBulk(e.target.value)}
        placeholder={"MEX1 BRA7 ARG10\no separadas por comas: MEX1, BRA7\no una por línea"}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-sm outline-none focus:border-brand-400 transition-colors resize-none mb-2"
      />
      <button
        onClick={handleBulkAdd}
        disabled={!bulk.trim()}
        className="w-full py-3.5 rounded-xl bg-brand-400 text-white font-medium text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
      >
        Agregar todas
      </button>
    </div>
  )
}
