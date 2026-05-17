interface StatCardProps {
  label: string
  value: number | string
  color?: 'green' | 'red' | 'amber' | 'blue' | 'default' | 'purple' | 'pink' | 'aqua'
}

const colorMap = {
  green: 'text-brand-400',
  red:   'text-red-600 dark:text-red-600',
  amber: 'text-amber-600 dark:text-amber-400',
  blue:  'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-500',
  pink: 'text-rose-600 dark:text-pink-400',
  aqua: 'text-lime-600 dark:text-lime-400', 
  default: 'text-neutral-800 dark:text-neutral-100',
}

export function StatCard({ label, value, color = 'default' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/5 dark:border-white/5 p-3.5">
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-1.5">{label}</p>
      <p className={`text-[26px] font-semibold leading-none tracking-tight ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  )
}
