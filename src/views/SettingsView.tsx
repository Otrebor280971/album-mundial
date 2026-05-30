import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStickerStore, ALBUM_VERSIONS } from '../store/stickerStore'
import { STICKERS } from '../data/stickers'
import type { View } from '../types'
import type { AlbumVersion } from '../store/stickerStore'
import { Album, Languages, BookMarked} from 'lucide-react'


interface SettingsViewProps {
  onNavigate: (view: View) => void
  onOpenTutorial: () => void
}

const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
]

export function SettingsView({ onOpenTutorial }: SettingsViewProps) {
  const { t, i18n } = useTranslation()
  const albumVersion    = useStickerStore(s => s.albumVersion)
  const setAlbumVersion = useStickerStore(s => s.setAlbumVersion)

  const [showLangPicker,    setShowLangPicker]    = useState(false)
  const [showVersionPicker, setShowVersionPicker] = useState(false)

  function handleLang(code: string) {
    i18n.changeLanguage(code)
    localStorage.setItem('i18n-lang', code)
    setShowLangPicker(false)
  }

  function handleVersion(version: AlbumVersion) {
    setAlbumVersion(version)
    setShowVersionPicker(false)
  }

  const currentVersionLabel = albumVersion
    ? t(`settings.version_${albumVersion}`)
    : t('settings.version_none')

  return (
    <div className="px-4 pt-4 pb-24 text-neutral-100">
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">{t('settings.title')}</h1>
      <p className="text-sm text-neutral-400 mb-6">{t('settings.subtitle')}</p>

      <div className="flex flex-col gap-3">

        {/* Tutorial */}
        <button
          onClick={onOpenTutorial}
          className="bg-neutral-900 border border-white/5 rounded-xl p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-school text-brand-400 text-xl" />
            <Album/>
          </div>
          <div>
            <p className="text-sm font-medium">{t('settings.tutorial_title')}</p>
            <p className="text-xs text-neutral-400">{t('settings.tutorial_desc')}</p>
          </div>
          <i className="ti ti-chevron-right text-neutral-600 ml-auto" />
        </button>

        {/* Idioma */}
        <button
          onClick={() => setShowLangPicker(true)}
          className="bg-neutral-900 border border-white/5 rounded-xl p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-language text-brand-400 text-xl" />
            <Languages/>
          </div>
          <div>
            <p className="text-sm font-medium">{t('settings.language_title')}</p>
            <p className="text-xs text-neutral-400">
              {LANGUAGES.find(l => l.code === i18n.language)?.label ?? i18n.language}
            </p>
          </div>
          <i className="ti ti-chevron-right text-neutral-600 ml-auto" />
        </button>

        {/* Versión del álbum */}
        <button
          onClick={() => setShowVersionPicker(true)}
          className="bg-neutral-900 border border-white/5 rounded-xl p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-album text-brand-400 text-xl" />
            <BookMarked/>
          </div>
          <div>
            <p className="text-sm font-medium">{t('settings.version_title')}</p>
            <p className="text-xs text-neutral-400">{currentVersionLabel}</p>
          </div>
          <i className="ti ti-chevron-right text-neutral-600 ml-auto" />
        </button>

      </div>

      {/* ── Sheet: Idioma ─────────────────────────────────────────────── */}
      {showLangPicker && (
        <BottomSheet onClose={() => setShowLangPicker(false)} title={t('settings.language_title')}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLang(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-colors ${
                i18n.language === lang.code
                  ? 'bg-brand-600/20 text-brand-400 font-medium'
                  : 'bg-neutral-800/50 text-neutral-100 hover:bg-neutral-800'
              }`}
            >
              {lang.label}
              {i18n.language === lang.code && <i className="ti ti-check text-brand-400" />}
            </button>
          ))}
        </BottomSheet>
      )}

      {/* ── Sheet: Versión ────────────────────────────────────────────── */}
      {showVersionPicker && (
        <BottomSheet onClose={() => setShowVersionPicker(false)} title={t('settings.version_title')}>
          {(Object.entries(ALBUM_VERSIONS) as [AlbumVersion, typeof ALBUM_VERSIONS[AlbumVersion]][]).map(([key, val]) => {
            const total = STICKERS.length + val.ccStickers.length
            return (
              <button
                key={key}
                onClick={() => handleVersion(key)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-colors ${
                  albumVersion === key
                    ? 'bg-brand-600/20 text-brand-400 font-medium'
                    : 'bg-neutral-800/50 text-neutral-100 hover:bg-neutral-800'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span>{t(`settings.version_${key}`)}</span>
                  <span className="text-[11px] text-neutral-400 font-normal">
                    {t('settings.version_stickers', { count: total })}
                  </span>
                </div>
                {albumVersion === key && <i className="ti ti-check text-brand-400" />}
              </button>
            )
          })}
        </BottomSheet>
      )}
    </div>
  )
}

// ── Componente auxiliar reutilizable ──────────────────────────────────────────
function BottomSheet({ title, onClose, children }: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm pb-8 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl p-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-sm font-semibold text-neutral-100 mb-4">{title}</p>
        <div className="flex flex-col gap-2">{children}</div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl border border-white/10 text-neutral-400 text-sm hover:bg-white/5 transition-colors"
        >
          {t('settings.cancel')}
        </button>
      </div>
    </div>
  )
}