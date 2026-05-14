# Álbum Panini Mundial FIFA 2026

PWA completa para gestionar tu álbum de estampas Panini del Mundial 2026.

## Stack

- **React 18** + **TypeScript** — UI y tipado estricto
- **Vite** — build tool ultrarrápido
- **TailwindCSS** — estilos mobile-first
- **Zustand** + **localStorage** — estado persistente sin backend
- **Fuse.js** — búsqueda fuzzy inteligente
- **vite-plugin-pwa** — installable, offline-first

## Funcionalidades

- ✅ Registrar estampas al abrir sobres (búsqueda fuzzy + pegado masivo)
- ✅ Álbum visual por país con código de colores
- ✅ Lista de faltantes con filtros y copia al portapapeles
- ✅ Gestión de intercambios
- ✅ Progreso total con porcentaje
- ✅ 100% offline, sin backend
- ✅ Installable como PWA en iOS/Android/Desktop
- ✅ Dark mode automático

## Instalación

```bash
npm install
npm run dev
```

## Build para producción

```bash
npm run build
npm run preview
```

## Deploy en Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

O conecta el repo en vercel.com → **Framework: Vite** → auto-deploy en cada push.

## Estructura

```
src/
├── components/
│   ├── BottomNav.tsx     # Navegación inferior
│   ├── StickerCard.tsx   # Tarjeta de estampa individual
│   └── StatCard.tsx      # Tarjeta de estadística
├── views/
│   ├── HomeView.tsx      # Pantalla principal con stats
│   ├── PacksView.tsx     # Abrir sobres + búsqueda fuzzy
│   ├── AlbumView.tsx     # Grilla visual por país
│   ├── MissingView.tsx   # Lista de faltantes
│   └── TradeView.tsx     # Gestión de intercambios
├── store/
│   └── stickerStore.ts   # Zustand store con persistencia
├── data/
│   └── stickers.ts       # Dataset (escalable a 980 estampas)
├── hooks/
│   ├── useFuseSearch.ts  # Búsqueda fuzzy con Fuse.js
│   └── useToast.tsx      # Sistema de notificaciones
├── utils/
│   └── parseBulk.ts      # Parser de pegado masivo
└── types/
    └── index.ts          # Tipos TypeScript
```

## Escalar el dataset

Edita `src/data/stickers.ts` para agregar las ~980 estampas reales. Cada estampa sigue la estructura:

```ts
{
  id: 'MEX17',         // Código único: {COUNTRY_CODE}{NUMBER}
  country: 'México',   // Nombre del país
  number: 17,          // Número en el álbum
  code: 'MEX',         // Código corto del país
  name: 'Santi Giménez',
  type: 'normal',      // 'normal' | 'foil' | 'extra'
}
```
