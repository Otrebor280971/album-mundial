import { useStickerStore } from '../store/stickerStore'
import { StatCard } from '../components/StatCard'
import type { View } from '../types'
import { Package, BookOpen, ListChecks, Repeat } from 'lucide-react'

interface HomeViewProps {
  onNavigate: (view: View) => void
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const getStats = useStickerStore(s => s.getStats)
  const stats = getStats()


  const actions = [
    {
      view: 'packs' as View,
      icon: <Package size={28} />,
      title: 'Abrir sobres',
      desc: 'Registra nuevas estampas',
    },
    {
      view: 'album' as View,
      icon: <BookOpen size={28} />,
      title: 'Ver álbum',
      desc: 'Tu colección completa',
    },
    {
      view: 'missing' as View,
      icon: <ListChecks size={28} />,
      title: 'Faltantes',
      desc: 'Las que te quedan',
    },
    {
      view: 'trade' as View,
      icon: <Repeat size={28} />,
      title: 'Intercambiar',
      desc: 'Gestiona cambios',
    },
  ]

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">Mi Álbum</h1>
      <p className="text-sm text-neutral-400 mb-5">Mundial FIFA 2026</p>

      {/* Progress */}
      <div className="bg-[#111111] rounded-xl border border-neutral-800 p-4 mb-4">
        <div className="flex justify-between items-baseline mb-2.5">
          <span className="text-sm text-neutral-400">Progreso total</span>
          <span className="text-xl font-semibold text-brand-400">{stats.completionPct}%</span>
        </div>
        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-400 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionPct}%` }}
          />
        </div>
        <p className="text-xs text-neutral-400 mt-2">{stats.owned} de {stats.total} estampas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <StatCard label="Tengo" value={stats.owned} color="green" />
        <StatCard label="Faltan" value={stats.missing} color="red" />
        <StatCard label="Repetidas" value={stats.duplicates} color="amber" />
        <StatCard label="Selecciones" value={
          Object.keys(
            Object.fromEntries(
              Object.keys(useStickerStore.getState().inventory).map(id => [id.replace(/\d+$/, ''), true])
            )
          ).length
        } color="blue" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ view, icon, title, desc }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className="bg-[#111111] rounded-xl border border-neutral-800 p-4 text-left flex flex-col gap-2 active:scale-[0.97] transition-transform duration-100 cursor-pointer"
          >
            <div className="text-brand-400">
              {icon}
            </div>
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
