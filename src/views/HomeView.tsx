import { useStickerStore } from '../store/stickerStore'
import { StatCard } from '../components/StatCard'
import type { View } from '../types'
import { Package, BookOpen, ListChecks, Repeat } from 'lucide-react'
import { STICKERS } from '../data/stickers'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { ALBUM_VERSIONS } from '../store/stickerStore'
import { getStickersByCountry } from '../data/stickers'
import { useToast } from '../hooks/useToast'

interface HomeViewProps {
  onNavigate: (view: View) => void
}

function formatGrouped(ids: string[]): string {
  const groups: Record<string, string[]> = {}
  ids.forEach(id => {
    const match  = id.match(/^([A-Z]+)(\d+)$/)
    const prefix = match ? match[1] : id
    const number = match ? match[2] : id
    if (!groups[prefix]) groups[prefix] = []
    groups[prefix].push(number)
  })
  return Object.entries(groups)
    .map(([prefix, numbers]) => `${prefix}: ${numbers.join(', ')}`)
    .join('\n')
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const getStats      = useStickerStore(s => s.getStats)
  const getMissing    = useStickerStore(s => s.getMissing)
  const getDuplicates = useStickerStore(s => s.getDuplicates)
  const inventory     = useStickerStore(s => s.inventory)
  const albumVersion  = useStickerStore(s => s.albumVersion)
  const stats         = getStats()

  const byCountry  = getStickersByCountry(albumVersion)
  const ccStickers = albumVersion ? ALBUM_VERSIONS[albumVersion].ccStickers : []
  const totalCC    = ccStickers.length
  const totalFWC   = STICKERS.filter(s => s.code === 'FWC').length
  const totalRegular = stats.total - totalCC

  const ownedCC  = Object.keys(inventory).filter(id => id.startsWith('CC') && inventory[id] > 0).length
  const ownedFWC = Object.keys(inventory).filter(id => (id.startsWith('FWC') || id === '00') && inventory[id] > 0).length
  const ownedRegular = stats.owned - ownedCC

  const [showComplete, setShowComplete] = useState(false)

  const seleccionesUnicas = new Set(
    Object.keys(inventory)
      .filter(id => inventory[id] > 0)
      .map(id => id.replace(/\d+$/, ''))
      .filter(code => code !== 'CC' && code !== 'FWC' && code !== '')
  ).size

  const seleccionesCompletas = Object.entries(byCountry).filter(([code, stickers]) => {
    if (code === 'CC' || code === 'FWC') return false
    return stickers.every(s => (inventory[s.id] ?? 0) >= 1)
  }).length

  async function copyMissing() {
    const missing = getMissing()
    const text = formatGrouped(missing.map(s => s.id))
    await navigator.clipboard.writeText(text)
    toast(t('toast.copied'))
  }

  async function copyDuplicates() {
    const dups = getDuplicates()
    const groups: Record<string, string[]> = {}
    dups.forEach(s => {
      const match     = s.id.match(/^([A-Z]+)(\d+)$/)
      const prefix    = match ? match[1] : s.id
      const number    = match ? match[2] : s.id
      const available = (inventory[s.id] ?? 0) - 1
      if (!groups[prefix]) groups[prefix] = []
      for (let i = 0; i < available; i++) groups[prefix].push(number)
    })
    const text = Object.entries(groups)
      .map(([prefix, numbers]) => `${prefix}: ${numbers.join(', ')}`)
      .join('\n')
    await navigator.clipboard.writeText(text)
    toast(t('toast.copied'))
  }

  const actions = [
    {
      view: 'packs' as View,
      icon: <Package size={28} />,
      title: t('home.action_packs_title'),
      desc: t('home.action_packs_desc'),
    },
    {
      view: 'album' as View,
      icon: <BookOpen size={28} />,
      title: t('home.action_album_title'),
      desc: t('home.action_album_desc'),
    },
    {
      view: 'missing' as View,
      icon: <ListChecks size={28} />,
      title: t('home.action_missing_title'),
      desc: t('home.action_missing_desc'),
    },
    {
      view: 'trade' as View,
      icon: <Repeat size={28} />,
      title: t('home.action_trade_title'),
      desc: t('home.action_trade_desc'),
    },
  ]

  return (
    <div className="px-4 pt-4 pb-24 text-neutral-100">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">{t('home.title')}</h1>
      <br />
      <br />

      {/* Progress */}
      <div className="bg-[#111111] rounded-xl border border-neutral-800 p-4 mb-4">
        <div className="flex justify-between items-baseline mb-2.5">
          <span className="text-sm text-neutral-400">{t('home.progress_label')}</span>
          <span className="text-xl font-semibold text-brand-400">{stats.completionPct}%</span>
        </div>
        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-400 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionPct}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-neutral-400">
          <span>{t('home.progress_stickers', { ownedRegular, totalRegular })}</span>
          <span>{t('home.progress_cc', { ownedCC, totalCC })}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <StatCard label={t('home.stat_owned')}      value={stats.owned}      color="aqua" />
        <StatCard
          label={t('home.stat_missing')}
          value={stats.missing}
          color="red"
          onTap={copyMissing}
        />
        <StatCard
          label={t('home.stat_duplicates')}
          value={stats.duplicates}
          color="pink"
          onTap={copyDuplicates}
        />
        <StatCard
          label={showComplete ? t('home.stat_teams_complete') : t('home.stat_teams')}
          value={showComplete ? `${seleccionesCompletas} / 48` : `${seleccionesUnicas} / 48`}
          color="blue"
          onTap={() => setShowComplete(v => !v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <StatCard label={t('home.stat_cc')}  value={`${ownedCC} / ${totalCC}`}   color="amber"  />
        <StatCard label={t('home.stat_fwc')} value={`${ownedFWC} / ${totalFWC}`} color="purple" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ view, icon, title, desc }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className="bg-[#111111] rounded-xl border border-neutral-800 p-4 text-left flex flex-col gap-2 active:scale-[0.97] transition-transform duration-100 cursor-pointer hover:bg-neutral-900"
          >
            <div className="text-brand-400">{icon}</div>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-neutral-400">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}