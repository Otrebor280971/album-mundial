import { useMemo, useState, useCallback } from 'react'
import Fuse from 'fuse.js'
import type { Sticker } from '../types'
import { STICKERS } from '../data/stickers'

const fuse = new Fuse(STICKERS, {
  keys: ['id', 'name', 'country', 'code'],
  threshold: 0.4,
  includeScore: true,
  shouldSort: true,
})

export function useFuseSearch(limit = 8) {
  const [query, setQuery] = useState('')

  const results: Sticker[] = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, limit).map(r => r.item)
  }, [query, limit])

  const clear = useCallback(() => setQuery(''), [])

  return { query, setQuery, results, clear }
}
