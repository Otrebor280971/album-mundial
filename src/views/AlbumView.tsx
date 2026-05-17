import { useStickerStore } from '../store/stickerStore'
import { StickerCard } from '../components/StickerCard'
import { useToast } from '../hooks/useToast'
import { getStickersByCountry } from '../data/stickers'
import { COUNTRY_META } from '../data/CountryMeta' // <-- Asegura que esta ruta sea correcta

export function AlbumView() {
  const inventory = useStickerStore(s => s.inventory)
  const addSticker = useStickerStore(s => s.addSticker)
  const removeSticker = useStickerStore(s => s.removeSticker)
  const { toast } = useToast()

  const byCountry = getStickersByCountry()

  function handleTap(id: string, name: string, isOwned: boolean) {
    if (isOwned) { removeSticker(id); toast(`Eliminada: ${name}`) }
    else         { addSticker(id);    toast(`✓ ${name} agregada`)  }
  }

  return (
    <div className="px-4 pt-4 pb-24 text-neutral-100">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">Álbum</h1>
      <p className="text-sm text-neutral-400 mb-5">Toca una estampa para marcarla</p>

      {Object.entries(byCountry).map(([code, stickers]) => {
        const owned = stickers.filter(s => (inventory[s.id] ?? 0) >= 1).length
        
        // Buscamos los metadatos visuales del país o usamos fallback
        const meta = COUNTRY_META[code]
        const Icon = meta?.icon
        const name = meta?.label || code

        return (
          <section key={code} className="mb-6">
            <div className="flex justify-between items-center mb-2.5">
              <h2 className="text-base font-semibold flex items-center gap-2">
                {Icon ? <Icon /> : null}
                {name}
              </h2>
              <span className="text-xs text-neutral-400">{owned}/{stickers.length}</span>
            </div>
            
            {/* Barra de progreso modo oscuro */}
            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-brand-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((owned / stickers.length) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {stickers.map(sticker => (
                <StickerCard
                  key={sticker.id}
                  {...sticker}
                  isOwned={(inventory[sticker.id] ?? 0) >= 1}
                  count={inventory[sticker.id] ?? 0}
                  isfoil={sticker.type === 'foil'}
                  onTap={() => handleTap(sticker.id, sticker.name, (inventory[sticker.id] ?? 0) >= 1)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}