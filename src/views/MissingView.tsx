import { useState } from 'react'
import { useStickerStore } from '../store/stickerStore'
import { useToast } from '../hooks/useToast'
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '../data/stickers'

export function MissingView() {
  const getMissing = useStickerStore(s => s.getMissing)
  const addSticker = useStickerStore(s => s.addSticker)
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [activeCode, setActiveCode] = useState<string | null>(null)

  const missing = getMissing()
  const codes = [...new Set(missing.map(s => s.code))]

  const filtered = missing.filter(s => {
    const matchCode = activeCode ? s.code === activeCode : true
    const q = search.toLowerCase()
    const matchSearch = !q || s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    return matchCode && matchSearch
  })

  async function copyList() {
    const text = filtered.map(s => s.id).join('\n')
    await navigator.clipboard.writeText(text)
    toast(`Lista copiada (${filtered.length} estampas)`)
  }

  return (
    <div className="px-4 pt-4 pb-24 text-neutral-100">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">Faltantes</h1>
      <p className="text-sm text-neutral-400 mb-4">{missing.length} estampas por conseguir</p>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar faltante..."
        className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-[#111111] text-neutral-100 placeholder:text-neutral-500 text-sm outline-none focus:border-brand-400 transition-colors mb-3"
      />

      {/* Country filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none" role="group" aria-label="Filtrar por selección">
        <button
          onClick={() => setActiveCode(null)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs border transition-all ${
            !activeCode
              ? 'bg-brand-400 border-brand-400 text-white'
              : 'bg-[#111111] border-neutral-800 text-neutral-400'
          }`}
        >
          Todas ({missing.length})
        </button>
        {codes.map(code => (
          <button
            key={code}
            onClick={() => setActiveCode(activeCode === code ? null : code)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs border transition-all whitespace-nowrap ${
              activeCode === code
                ? 'bg-brand-400 border-brand-400 text-white'
                : 'bg-[#111111] border-neutral-800 text-neutral-400'
            }`}
          >
            {COUNTRY_FLAGS[code] ?? ''} {COUNTRY_NAMES[code] ?? code}
          </button>
        ))}
      </div>

      <button
        onClick={copyList}
        disabled={filtered.length === 0}
        className="w-full py-2.5 rounded-xl border border-neutral-800 bg-[#111111] text-neutral-100 text-sm font-medium mb-4 flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <i className="ti ti-copy text-base" aria-hidden="true" />
        Copiar lista ({filtered.length})
      </button>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-neutral-400">
          <i className="ti ti-mood-happy text-4xl mb-3 block" aria-hidden="true" />
          <p className="text-sm">¡No faltan estampas en esta selección!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(sticker => (
            <div
              key={sticker.id}
              className="bg-[#111111] rounded-xl border border-neutral-800 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <span className="text-sm font-bold text-red-500">{sticker.id}</span>
                <p className="text-sm text-neutral-100">
                  {sticker.type === 'foil' && '⭐ '}{sticker.name}
                </p>
                <p className="text-xs text-neutral-400">
                  {COUNTRY_FLAGS[sticker.code] ?? ''} {sticker.country}
                </p>
              </div>
              <button
                onClick={() => { addSticker(sticker.id); toast(`✓ ${sticker.id} agregada`) }}
                className="bg-brand-600/20 text-brand-400 text-xs font-medium px-3 py-1.5 rounded-lg"
              >
                + Tengo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}