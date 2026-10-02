import raw from '../words.json'

export interface WordImage {
  src: string
  caption?: string
  href?: string
  title?: string
  detail?: string
  /** Jukebox title strip text (TitleStrips page type) */
  strip?: { a: string; artist: string; b: string }
}

export interface Word {
  id: string
  label: string
  category?: string
  font: string
  weight?: number
  pageType?: string
  leadText?: string
  bodyText?: string
  images?: WordImage[]
  /** Custom phrase for the hero ticker, instead of "a <label>" */
  heroPhrase?: string
  /** false keeps the word out of the falling pile and the hero ticker (e.g. Hire Me) */
  pile?: boolean
}

export const allWords = raw as Word[]

/** Words that fall in the pile. Their order matches the physics bodies. */
export const pileWords = allWords.filter(w => w.pile !== false)

export const findWord = (id: string | null | undefined) =>
  id ? allWords.find(w => w.id === id) : undefined

/** Stable per-word index, so a word gets the same paper and torn edge everywhere */
export const paperIndex = (id: string) => Math.max(0, allWords.findIndex(w => w.id === id))

export const articleFor = (label: string) => (/^[aeiou]/i.test(label) ? 'an' : 'a')

// Small deterministic hash, so "random" picks don't change between visits
const hash = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/**
 * Other identities to suggest at the bottom of a page: one from the same
 * category if there is one, then a deterministic mix of the rest.
 */
export const relatedWords = (id: string, count = 3): Word[] => {
  const self = findWord(id)
  const others = pileWords.filter(w => w.id !== id)
  const byHash = (a: Word, b: Word) => hash(id + a.id) - hash(id + b.id)
  const sameCategory = others.filter(w => w.category === self?.category).sort(byHash)
  const rest = others.filter(w => w.category !== self?.category).sort(byHash)
  return [...sameCategory.slice(0, 1), ...rest].slice(0, count)
}
