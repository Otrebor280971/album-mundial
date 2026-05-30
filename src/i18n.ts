import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './languages/es.json'
import en from './languages/en.json'

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('i18n-lang') ?? 'es',
  fallbackLng: 'es',
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
})

export default i18n