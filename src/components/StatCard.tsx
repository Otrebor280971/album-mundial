interface StatCardProps {
  label: string
  value: number | string
  color?: 'green' | 'red' | 'amber' | 'blue' | 'default' | 'purple' | 'pink' | 'aqua'
}

const colorMap = {
  green: 'text-brand-400',
  red: 'text-red-500',
  amber: 'text-amber-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  pink: 'text-pink-400',
  aqua: 'text-lime-400', 
  default: 'text-neutral-100',
}

export function StatCard({ label, value, color = 'default' }: StatCardProps) {
  return (
    <div className="bg-[#111111] rounded-xl border border-neutral-800 p-3.5">
      <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-1.5">{label}</p>
      <p className={`text-[26px] font-semibold leading-none tracking-tight ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  )
}