import { useState } from 'react'
import { useStickerStore } from '../store/stickerStore'
import { useToast } from '../hooks/useToast'
import { useTranslation } from 'react-i18next'

export function TradeView() {
  const getMissing    = useStickerStore(s => s.getMissing)
  const getDuplicates = useStickerStore(s => s.getDuplicates)
  const tradeSticker  = useStickerStore(s => s.tradeSticker)
  const inventory     = useStickerStore(s => s.inventory)
  const { toast } = useToast()
  const { t } = useTranslation()

  const [giveId, setGiveId]       = useState('')
  const [receiveId, setReceiveId] = useState('')
  const [copied, setCopied]       = useState(false)

  const missing = getMissing()
  const dups    = getDuplicates()

  function confirmTrade() {
    const isGiveValid    = dups.some(s => s.id === giveId)
    const isReceiveValid = missing.some(s => s.id === receiveId)

    if (!isGiveValid || !isReceiveValid) {
      toast(t('toast.trade_invalid'))
      return
    }

    tradeSticker(giveId, receiveId)
    setGiveId('')
    setReceiveId('')
    toast(t('toast.trade_success'))
  }

  function copyDuplicates() {
    // Agrupar duplicadas por prefijo (todo lo que no sea números al final)
    const groups: Record<string, string[]> = {}
    dups.forEach(s => {
      const match  = s.id.match(/^([A-Z]+)(\d+)$/)
      const prefix = match ? match[1] : s.id
      const number = match ? match[2] : s.id
      const available = (inventory[s.id] ?? 0) - 1

      if (!groups[prefix]) groups[prefix] = []
      // Si hay más de 1 disponible para intercambiar, repetir el número
      for (let i = 0; i < available; i++) {
        groups[prefix].push(number)
      }
    })

    const text = Object.entries(groups)
      .map(([prefix, numbers]) => `${prefix}: ${numbers.join(', ')}`)
      .join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast(t('toast.copied'))
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="px-4 pt-4 pb-24 text-neutral-100">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">{t('trade.title')}</h1>
      <p className="text-sm text-neutral-400 mb-4">{t('trade.subtitle')}</p>

      {/* Two-column summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-neutral-900 rounded-xl border border-white/5 p-3.5">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5 flex items-center gap-1">
            <i className="ti ti-circle-x text-red-400 text-sm" aria-hidden="true" /> {t('trade.col_missing')}
          </p>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto">
            {missing.length === 0 ? (
              <p className="text-xs text-neutral-400">{t('trade.col_missing_empty')}</p>
            ) : missing.slice(0, 30).map(s => (
              <div key={s.id} className="flex items-center justify-between bg-red-900/15 rounded-lg px-2 py-1">
                <span className="text-xs font-semibold text-red-400">{s.id}</span>
                <span className="text-[10px] text-neutral-500 truncate ml-1 max-w-[60px]">{s.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-white/5 p-3.5">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5 flex items-center gap-1">
            <i className="ti ti-circle-check text-brand-400 text-sm" aria-hidden="true" /> {t('trade.col_duplicates')}
          </p>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto">
            {dups.length === 0 ? (
              <p className="text-xs text-neutral-400">{t('trade.col_duplicates_empty')}</p>
            ) : dups.map(s => {
              const available = (inventory[s.id] ?? 0) - 1
              return (
                <div key={s.id} className="flex items-center justify-between bg-brand-600/20 rounded-lg px-2 py-1">
                  <span className="text-xs font-semibold text-brand-400">{s.id}</span>
                  <span className="text-[10px] font-semibold text-brand-400">×{available}</span>
                </div>
              )
            })}
          </div>

          {/* Botón copiar — solo aparece si hay duplicadas */}
          {dups.length > 0 && (
            <button
              onClick={copyDuplicates}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/35 text-brand-400 text-[11px] font-semibold transition-colors active:scale-[0.97]"
            >
              <i className={`ti ${copied ? 'ti-check' : 'ti-clipboard'} text-sm`} aria-hidden="true" />
              {copied ? t('toast.copied') : t('trade.copy_button')}
            </button>
          )}
        </div>
      </div>

      {/* Trade form */}
      <div className="bg-neutral-900 rounded-xl border border-white/5 p-4 mb-4">
        <p className="text-sm font-medium mb-4">{t('trade.form_title')}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-neutral-400 mb-1.5">{t('trade.give_label')}</p>
            <input
              list="give-list"
              value={giveId}
              onChange={e => setGiveId(e.target.value.toUpperCase())}
              placeholder={t('trade.give_placeholder')}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-neutral-950 text-neutral-100 text-sm outline-none placeholder:text-neutral-600 focus:border-brand-400 transition-colors"
            />
            <datalist id="give-list">
              {dups.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({t('trade.give_hint', { count: (inventory[s.id] ?? 0) - 1 })})
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1.5">{t('trade.receive_label')}</p>
            <input
              list="receive-list"
              value={receiveId}
              onChange={e => setReceiveId(e.target.value.toUpperCase())}
              placeholder={t('trade.receive_placeholder')}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-neutral-950 text-neutral-100 text-sm outline-none placeholder:text-neutral-600 focus:border-brand-400 transition-colors"
            />
            <datalist id="receive-list">
              {missing.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </datalist>
          </div>
        </div>

        <button
          onClick={confirmTrade}
          disabled={!giveId || !receiveId}
          className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          {t('trade.confirm_button')}
        </button>
      </div>
    </div>
  )
}