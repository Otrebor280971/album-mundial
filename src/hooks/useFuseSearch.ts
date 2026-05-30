import { useMemo, useState, useCallback } from 'react'
import Fuse from 'fuse.js'
import type { Sticker } from '../types'
import { STICKERS, STICKERS_CC_MEX, STICKERS_CC_USA } from '../data/stickers'
import { useStickerStore } from '../store/stickerStore'
import type { AlbumVersion } from '../store/stickerStore'

const FUSE_OPTIONS = {
  keys: ['id', 'name', 'country', 'code'],
  threshold: 0.4,
  includeScore: true,
  shouldSort: true,
}

function getFullStickers(version: AlbumVersion | null): Sticker[] {
  if (version === 'MEX') return [...STICKERS, ...STICKERS_CC_MEX]
  if (version === 'USA') return [...STICKERS, ...STICKERS_CC_USA]
  return STICKERS
}

export function useFuseSearch(limit = 8) {
  const [query, setQuery] = useState('')
  const albumVersion = useStickerStore(s => s.albumVersion)

  const fuse = useMemo(
    () => new Fuse(getFullStickers(albumVersion), FUSE_OPTIONS),
    [albumVersion]
  )

  const results: Sticker[] = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, limit).map(r => r.item)
  }, [query, limit, fuse])

  const clear = useCallback(() => setQuery(''), [])

  return { query, setQuery, results, clear }
}