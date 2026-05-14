import { useState } from 'react'
import { BottomNav }  from './components/BottomNav'
import { ToastProvider } from './hooks/useToast'
import { HomeView }    from './views/HomeView'
import { PacksView }   from './views/PacksView'
import { AlbumView }   from './views/AlbumView'
import { MissingView } from './views/MissingView'
import { TradeView }   from './views/TradeView'
import type { View } from './types'

export default function App() {
  const [view, setView] = useState<View>('home')

  const views: Record<View, JSX.Element> = {
    home:    <HomeView onNavigate={setView} />,
    packs:   <PacksView />,
    album:   <AlbumView />,
    missing: <MissingView />,
    trade:   <TradeView />,
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 max-w-lg mx-auto relative">
        <main>
          {views[view]}
        </main>
        <BottomNav current={view} onChange={setView} />
      </div>
    </ToastProvider>
  )
}
