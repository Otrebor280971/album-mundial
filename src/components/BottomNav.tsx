import {
  House,
  Package,
  BookOpen,
  ListChecks,
  Repeat,
} from 'lucide-react'

import type { View } from '../types'

interface NavItem {
  view: View
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    view: 'home',
    label: 'Inicio',
    icon: <House size={22} strokeWidth={2.2} />,
  },
  {
    view: 'packs',
    label: 'Sobres',
    icon: <Package size={22} strokeWidth={2.2} />,
  },
  {
    view: 'album',
    label: 'Álbum',
    icon: <BookOpen size={22} strokeWidth={2.2} />,
  },
  {
    view: 'missing',
    label: 'Faltantes',
    icon: <ListChecks size={22} strokeWidth={2.2} />,
  },
  {
    view: 'trade',
    label: 'Cambios',
    icon: <Repeat size={22} strokeWidth={2.2} />,
  },
]

interface BottomNavProps {
  current: View
  onChange: (view: View) => void
}

export function BottomNav({
  current,
  onChange,
}: BottomNavProps) {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        max-w-lg mx-auto
        bg-[#111111]
        border-t border-neutral-800
        flex z-50 pb-safe
      "
      role="navigation"
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map(({ view, label, icon }) => {
        const active = current === view

        return (
          <button
            key={view}
            onClick={() => onChange(view)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className={`
              flex-1 flex flex-col items-center justify-center
              gap-1 py-2 px-1
              transition-all duration-150
              active:scale-95
              ${
                active
                  ? 'text-brand-400'
                  : 'text-neutral-500'
              }
            `}
          >
            {icon}

            <span className="text-[10px] font-medium">
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}