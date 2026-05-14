import { STICKERS } from '../data/stickers'

/** Parsea texto libre de IDs separados por espacio, coma o salto de línea */
export function parseBulkInput(raw: string): { valid: string[]; invalid: string[] } {
  const tokens = raw
    .split(/[\s,\n]+/)
    .map(t => t.trim().toUpperCase())
    .filter(Boolean)

  const validSet = new Set(STICKERS.map(s => s.id))
  const valid: string[] = []
  const invalid: string[] = []

  for (const token of tokens) {
    if (validSet.has(token)) valid.push(token)
    else invalid.push(token)
  }

  return { valid, invalid }
}
