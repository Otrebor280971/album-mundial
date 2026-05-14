import { useState } from 'react'
import { useStickerStore } from '../store/stickerStore'
import { useToast } from '../hooks/useToast'

export function TradeView() {
  const getMissing    = useStickerStore(s => s.getMissing)
  const getDuplicates = useStickerStore(s => s.getDuplicates)
  const tradeSticker  = useStickerStore(s => s.tradeSticker)
  const inventory     = useStickerStore(s => s.inventory)
  const { toast } = useToast()

  const [giveId, setGiveId]    = useState('')
  const [receiveId, setReceiveId] = useState('')

  const missing = getMissing()
  const dups    = getDuplicates()

  function confirmTrade() {
    if (!giveId || !receiveId) { toast('⚠️ Selecciona ambas estampas'); return }
    tradeSticker(giveId, receiveId)
    setGiveId('')
    setReceiveId('')
    toast('✓ Intercambio realizado')
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">Intercambiar</h1>
      <p className="text-sm text-neutral-400 mb-4">Gestiona tus cambios</p>

      {/* Two-column summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/5 dark:border-white/5 p-3.5">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5 flex items-center gap-1">
            <i className="ti ti-circle-x text-red-400 text-sm" aria-hidden="true" /> Me faltan
          </p>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto">
            {missing.length === 0 ? (
              <p className="text-xs text-neutral-400">¡Ninguna! 🎉</p>
            ) : missing.slice(0, 30).map(s => (
              <div key={s.id} className="flex items-center justify-between bg-red-50 dark:bg-red-900/15 rounded-lg px-2 py-1">
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">{s.id}</span>
                <span className="text-[10px] text-neutral-500 truncate ml-1 max-w-[60px]">{s.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/5 dark:border-white/5 p-3.5">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5 flex items-center gap-1">
            <i className="ti ti-circle-check text-brand-400 text-sm" aria-hidden="true" /> Para dar
          </p>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto">
            {dups.length === 0 ? (
              <p className="text-xs text-neutral-400">Sin repetidas aún</p>
            ) : dups.map(s => {
              const available = (inventory[s.id] ?? 0) - 1
              return (
                <div key={s.id} className="flex items-center justify-between bg-brand-50 dark:bg-brand-600/20 rounded-lg px-2 py-1">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{s.id}</span>
                  <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">×{available}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Trade form */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/5 dark:border-white/5 p-4 mb-4">
        <p className="text-sm font-medium mb-4">Confirmar intercambio</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-neutral-400 mb-1.5">Yo entrego</p>
            <select
              value={giveId}
              onChange={e => setGiveId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-sm outline-none appearance-none"
            >
              <option value="">Seleccionar...</option>
              {dups.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.name} (×{(inventory[s.id] ?? 0) - 1} disp.)
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1.5">Yo recibo</p>
            <select
              value={receiveId}
              onChange={e => setReceiveId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-sm outline-none appearance-none"
            >
              <option value="">Seleccionar...</option>
              {missing.map(s => (
                <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={confirmTrade}
          disabled={!giveId || !receiveId}
          className="w-full py-3.5 rounded-xl bg-brand-400 text-white font-medium text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          Confirmar intercambio
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          if (confirm('¿Borrar toda la colección? Esta acción no se puede deshacer.')) {
            useStickerStore.getState().resetCollection()
            toast('Colección reiniciada')
          }
        }}
        className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 text-sm font-medium"
      >
        Reiniciar colección
      </button>
    </div>
  )
}
