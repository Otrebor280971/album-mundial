import type { Sticker } from '../types'
import type { AlbumVersion } from '../store/stickerStore'
import stickersRaw   from './stickers.txt?raw'
import stickersCCMex from './stickersCC-mexico.txt?raw'
import stickersCCUSA from './stickersCC-USA.txt?raw'

function parseStickerLine(line: string): Sticker | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  const firstSpace = trimmed.indexOf(' ')
  if (firstSpace === -1) return null

  const stickerId = trimmed.slice(0, firstSpace)
  let content = trimmed.slice(firstSpace + 1)

  const isFoil = content.includes('FOIL')
  content = content.replace('FOIL', '').trim()

  if (stickerId === '00') {
    return { id: '00', code: 'FWC', number: 0, country: 'Mundial', name: content, type: 'foil' }
  }

  const codeMatch   = stickerId.match(/[A-Z]+/)
  const numberMatch = stickerId.match(/\d+/)

  if (!codeMatch || !numberMatch) return null

  const code   = codeMatch[0]
  const number = Number(numberMatch[0])

  let country = 'Mundial'
  let name    = content

  if (code === 'CC') {
    country = 'Coca-Cola'
    if (content.includes(' - ')) {
      name = content.split(' - ')[0].trim()
    }
  } else if (content.includes(' - ')) {
    const parts = content.split(' - ')
    name    = parts[0].trim()
    country = parts[1].trim()
  } else if (code !== 'FWC') {
    country = code
  }

  return { id: stickerId, code, number, country, name, type: isFoil ? 'foil' : 'normal' }
}

function parseRaw(raw: string): Sticker[] {
  return raw
    .split('\n')
    .map(parseStickerLine)
    .filter(Boolean) as Sticker[]
}

export const STICKERS:        Sticker[] = parseRaw(stickersRaw)
export const STICKERS_CC_MEX: Sticker[] = parseRaw(stickersCCMex)
export const STICKERS_CC_USA: Sticker[] = parseRaw(stickersCCUSA)

export const COUNTRY_FLAGS: Record<string, string> = {}

export const COUNTRY_NAMES: Record<string, string> = {}
for (const sticker of STICKERS) {
  if (!COUNTRY_NAMES[sticker.code]) {
    COUNTRY_NAMES[sticker.code] = sticker.country
  }
}

function getVersionCC(version: AlbumVersion): Sticker[] {
  if (version === 'MEX') return STICKERS_CC_MEX
  if (version === 'USA') return STICKERS_CC_USA
  return []
}

export function getStickersByCountry(version: AlbumVersion | null): Record<string, Sticker[]> {
  const all = version ? [...STICKERS, ...getVersionCC(version)] : STICKERS
  return all.reduce<Record<string, Sticker[]>>((acc, sticker) => {
    if (!acc[sticker.code]) acc[sticker.code] = []
    acc[sticker.code].push(sticker)
    return acc
  }, {})
}