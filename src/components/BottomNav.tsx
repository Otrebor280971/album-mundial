import { House, Package, BookOpen, ListChecks, Repeat, Settings} from 'lucide-react'
import type { View } from '../types'
import { useTranslation } from 'react-i18next'

interface NavItem {
  view: View
  label: string
  icon: React.ReactNode
}



interface BottomNavProps {
  current: View
  onChange: (view: View) => void
}

export function BottomNav({
  current,
  onChange,
}: BottomNavProps) {
  
  const { t } = useTranslation()
  const NAV_ITEMS: NavItem[] = [
  {
    view: 'home',
    label: t('nav.home'),
    icon: <House size={22} strokeWidth={2.2} />,
  },
  {
    view: 'packs',
    label: t('nav.packs'),
    icon: <Package size={22} strokeWidth={2.2} />,
  },
  {
    view: 'album',
    label: t('nav.album'),
    icon: <BookOpen size={22} strokeWidth={2.2} />,
  },
  {
    view: 'missing',
    label: t('nav.missing'),
    icon: <ListChecks size={22} strokeWidth={2.2} />,
  },
  {
    view: 'trade',
    label: t('nav.trade'),
    icon: <Repeat size={22} strokeWidth={2.2} />,
  },
  {
    view: 'settings',
    label: t('nav.settings'),
    icon: <Settings size={22} strokeWidth={2.2} />,
  },
]

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