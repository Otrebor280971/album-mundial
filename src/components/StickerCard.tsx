interface StickerCardProps {
  id: string
  name: string
  number: number
  code: string
  isOwned: boolean
  count: number
  isfoil: boolean
  onTap?: () => void
}

export function StickerCard({ id, name, isOwned, count, isfoil, onTap }: StickerCardProps) {
  const isDuplicate = count > 1
  const shortName = name.length > 10 ? name.slice(0, 9) + '…' : name

  return (
    <button
      onClick={onTap}
      title={`${id} — ${name}`}
      className={`
        relative rounded-xl p-2 text-center border flex flex-col items-center justify-center min-h-[60px]
        transition-all duration-150 active:scale-95 cursor-pointer
        ${isOwned
          ? 'bg-brand-600/15 border-brand-500/40'
          : 'bg-neutral-900 border-neutral-800'
        }
      `}
    >
      {isfoil && (
        <span className="absolute top-0.5 left-1 text-[9px]" aria-label="foil">⭐</span>
      )}
      {isDuplicate && (
        <span className="absolute top-0.5 right-1 bg-brand-400 text-white rounded-full text-[8px] font-bold px-1 leading-4">
          ×{count}
        </span>
      )}
      <span className={`text-[10px] font-semibold leading-none ${isOwned ? 'text-brand-400' : 'text-neutral-400'}`}>
        {id}
      </span>
      <span className={`text-[9px] mt-0.5 leading-tight ${isOwned ? 'text-neutral-200' : 'text-neutral-500'}`}>
        {shortName}
      </span>
    </button>
  )
}
