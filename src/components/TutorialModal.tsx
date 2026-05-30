import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { View } from '../types'

interface TutorialModalProps {
  onClose: () => void
  onNavigate: (view: View) => void
}

interface TutorialStep {
  key: string
  navigateTo?: View
}

const STEPS: TutorialStep[] = [
  { key: 'welcome' },
  { key: 'nav' },
  { key: 'dashboard',   navigateTo: 'home'    },
  { key: 'stats',       navigateTo: 'home'    },
  { key: 'packs',       navigateTo: 'packs'   },
  { key: 'bulk',        navigateTo: 'packs'   },
  { key: 'album',       navigateTo: 'album'   },
  { key: 'missing',     navigateTo: 'missing' },
  { key: 'trade',       navigateTo: 'trade'   },
  { key: 'trade_form',  navigateTo: 'trade'   },
  { key: 'settings',    navigateTo: 'settings' },
]

export function TutorialModal({ onClose, onNavigate }: TutorialModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  function handleNext() {
    const next = STEPS[step + 1]
    if (next?.navigateTo) onNavigate(next.navigateTo)
    setStep(s => s + 1)
  }

  function handlePrev() {
    const prev = STEPS[step - 1]
    if (prev?.navigateTo) onNavigate(prev.navigateTo)
    setStep(s => s - 1)
  }

  function handleClose() {
    onNavigate('settings')
    onClose()
  }

  const title = t(`tutorial.steps.${current.key}.title`)
  const body  = t(`tutorial.steps.${current.key}.body`, { returnObjects: true }) as string[]

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 pb-8 px-4"
      onClick={handleClose}
    >
      {/* Card */}
      <div
        className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-5 bg-brand-400'
                  : i < step
                  ? 'w-1.5 bg-brand-600/50'
                  : 'w-1.5 bg-neutral-700'
              }`}
            />
          ))}
        </div>

        {/* Step counter */}
        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide mb-1">
          {t('tutorial.step_counter', { current: step + 1, total: STEPS.length })}
        </p>

        {/* Title */}
        <h2 className="text-lg font-bold text-neutral-100 mb-3">{title}</h2>

        {/* Body — array de párrafos o bullet points */}
        <div className="flex flex-col gap-2 mb-6">
          {body.map((line, i) => {
            const isBullet = line.startsWith('•')
            return isBullet ? (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-brand-400 mt-0.5 text-xs">•</span>
                <p className="text-sm text-neutral-300 leading-relaxed">{line.slice(1).trim()}</p>
              </div>
            ) : (
              <p key={i} className="text-sm text-neutral-300 leading-relaxed">{line}</p>
            )
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded-xl border border-white/10 text-neutral-400 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              {t('tutorial.prev')}
            </button>
          )}
          <button
            onClick={isLast ? handleClose : handleNext}
            className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors active:scale-[0.98]"
          >
            {isLast ? t('tutorial.finish') : t('tutorial.next')}
          </button>
        </div>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={handleClose}
            className="w-full mt-3 text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
          >
            {t('tutorial.skip')}
          </button>
        )}
      </div>
    </div>
  )
}