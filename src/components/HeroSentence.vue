<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { allWords, pileWords, articleFor as articleForLabel, type Word } from '../data/words'
import { categoryColors, fontFamilies } from '../constants'

const props = defineProps<{
  /** Id of the word currently held over the blank, if any */
  dropId: string | null
  /** Fades the sentence away (zero-gravity index mode) */
  hidden?: boolean
}>()

const slotEl = ref<HTMLElement | null>(null)
const lineEl = ref<HTMLElement | null>(null)
const prefixEl = ref<HTMLElement | null>(null)
const measureEl = ref<HTMLElement | null>(null)
// Drop target for dragged words: from the start of the blank to the end of the
// line, so it doesn't shrink and grow with whatever the ticker has typed.
const getDropRect = () => {
  const slot = slotEl.value
  const line = lineEl.value
  if (!slot || !line) return null
  const s = slot.getBoundingClientRect()
  const l = line.getBoundingClientRect()
  return new DOMRect(s.left, s.top, Math.max(s.width, l.right - s.left), s.height)
}
defineExpose({ getDropRect })

// Only words in the pile; they read as "Dan is a ___" unless they have a custom phrase
const cycleWords = pileWords

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const noHover = window.matchMedia('(hover: none)').matches
// On narrow screens the blank always sits on its own line
const stackedQuery = window.matchMedia('(max-width: 900px)')

const phraseFor = (w: Word) => w.heroPhrase || w.label.toLowerCase()
const articleFor = (w: Word) => (w.heroPhrase ? '' : articleForLabel(w.label))

const cycleIndex = ref(Math.floor(Math.random() * cycleWords.length))
const typed = ref('')
const fit = ref(1)

const cycleWord = computed(() => cycleWords[cycleIndex.value % cycleWords.length])
const dropWord = computed(() => (props.dropId ? allWords.find(w => w.id === props.dropId) : undefined))

const phrase = computed(() => (reducedMotion ? 'many things' : phraseFor(cycleWord.value)))
const article = computed(() => (reducedMotion ? '' : articleFor(cycleWord.value)))
const shownText = computed(() => (reducedMotion ? phrase.value : typed.value))

const slotFont = computed(() => {
  if (reducedMotion) return {}
  const w = cycleWord.value
  return {
    fontFamily: fontFamilies[w.font] || fontFamilies['moms-typewriter'],
    fontWeight: w.font === 'playfair-display' ? 900 : 400
  }
})

const slotColor = computed(() => {
  const w = dropWord.value || cycleWord.value
  return categoryColors[w.category || 'Portfolio'] || '#3592bf'
})

// ── Fit: shrink the blank's text so the sentence never wraps or reflows ──
// Measured against the *whole* upcoming phrase, and applied while the blank is
// empty between words, so the size never changes mid-word.
const updateFit = () => {
  const line = lineEl.value
  const measure = measureEl.value
  if (!line || !measure) return
  const natural = measure.offsetWidth
  if (!natural) return
  const fontSize = parseFloat(getComputedStyle(line).fontSize)
  const prefixWidth = stackedQuery.matches ? 0 : prefixEl.value?.offsetWidth ?? 0
  const reserve = fontSize * 0.32 + 6 // trailing dot + breathing room
  const available = line.clientWidth - prefixWidth - reserve
  fit.value = Math.max(0.4, Math.min(1, available / natural))
}

watch([phrase, article], () => nextTick(updateFit))

let resizeRaf = 0
const onResize = () => {
  if (resizeRaf) return
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = 0
    updateFit()
  })
}

// ── Typewriter loop: runs continuously, nothing interrupts it ──
let timer: ReturnType<typeof setTimeout> | undefined
let alive = true
const sleep = (ms: number) => new Promise<void>(r => (timer = setTimeout(r, ms)))

const runTypewriter = async () => {
  await sleep(900)
  while (alive) {
    const target = phraseFor(cycleWord.value)
    for (let i = 1; i <= target.length && alive; i++) {
      typed.value = target.slice(0, i)
      await sleep(55 + Math.random() * 75)
    }
    await sleep(2300)
    for (let i = target.length - 1; i >= 0 && alive; i--) {
      typed.value = target.slice(0, i)
      await sleep(24)
    }
    await sleep(320)
    cycleIndex.value++
  }
}

onMounted(() => {
  updateFit()
  document.fonts?.ready.then(updateFit)
  window.addEventListener('resize', onResize)
  stackedQuery.addEventListener('change', onResize)
  if (!reducedMotion) runTypewriter()
})

onUnmounted(() => {
  alive = false
  if (timer) clearTimeout(timer)
  if (resizeRaf) cancelAnimationFrame(resizeRaf)
  window.removeEventListener('resize', onResize)
  stackedQuery.removeEventListener('change', onResize)
})
</script>

<template>
  <section class="hero" :class="{ 'is-drop-ready': !!dropWord, 'is-hidden': hidden }"
    :aria-hidden="hidden || undefined" :style="{ '--slot-color': slotColor }">
    <p class="hero-kicker">
      <span>Engineer + Entrepreneur</span><span class="sep" aria-hidden="true">/</span><span class="hero-place">Knoxville, TN</span>
    </p>

    <h1 ref="lineEl" class="hero-line">
      <span class="sr-only">Dan is many things.</span>
      <!-- Explicit {{ ' ' }} spaces: the template compiler strips whitespace between inline elements -->
      <span aria-hidden="true"><span ref="prefixEl" class="hero-prefix">Dan is{{ ' ' }}<template v-if="article">{{ article }}{{ ' ' }}</template></span><span
          class="hero-blank"><span ref="slotEl" class="hero-slot" :style="{ ...slotFont, '--fit': fit }"><span
              class="hero-slot-text">{{ shownText }}</span><span v-if="!reducedMotion" class="caret"></span></span><span
            class="hero-dot"></span></span></span>
      <!-- Invisible copy of the full phrase, used to measure how much to shrink it -->
      <span ref="measureEl" class="hero-measure" aria-hidden="true" :style="slotFont">{{ phrase }}</span>
    </h1>

    <p class="hero-sub">
      People are many things, not just a job title.
      <span class="hero-hint">Drag a word into the blank, or {{ noHover ? 'tap' : 'click' }} one.</span>
    </p>
  </section>
</template>

<style scoped>
.hero {
  position: absolute;
  top: clamp(5.5rem, 16vh, 11rem);
  left: clamp(1.25rem, 7vw, 8rem);
  right: clamp(1.25rem, 7vw, 8rem);
  z-index: 2;
  pointer-events: none;
  user-select: none;
  color: var(--paper);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.hero.is-hidden {
  opacity: 0;
  transform: translateY(-12px);
}

.hero-kicker {
  font-family: var(--font-family);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--paper-dim);
  margin-bottom: clamp(0.8rem, 2vh, 1.4rem);
}

.hero-kicker .sep {
  margin: 0 0.8em;
  color: var(--paper-faint);
}

/* Fixed-height line: whatever font the blank uses, the line box is always the
   strut of this font, so nothing below it moves. */
.hero-line {
  position: relative;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.3rem, 1rem + 5vw, 6.5rem);
  line-height: 1.08;
  letter-spacing: -0.015em;
  white-space: nowrap;
}

.hero-prefix {
  font-style: italic;
}

.hero-blank {
  white-space: nowrap;
}

.hero-slot {
  display: inline-block;
  min-width: 4ch;
  height: 1.12em;
  line-height: 1.12em;
  vertical-align: bottom;
  padding: 0 0.12em;
  border-bottom: clamp(2px, 0.22vw, 4px) solid var(--paper-faint);
  font-size: calc(0.9em * var(--fit, 1));
  font-style: normal;
  text-transform: lowercase;
  white-space: nowrap;
  transform-origin: left bottom;
  transition:
    border-color 0.3s ease,
    background-color 0.25s ease,
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-slot-text,
.caret {
  transition: opacity 0.2s ease;
}

/* A word held over the blank: highlight it and fade the ticker under the card */
.hero.is-drop-ready .hero-slot {
  border-bottom-color: var(--slot-color);
  background-color: color-mix(in srgb, var(--slot-color) 14%, transparent);
  transform: scale(1.04);
}

.hero.is-drop-ready .hero-slot-text,
.hero.is-drop-ready .caret {
  opacity: 0.15;
}

.caret {
  display: inline-block;
  width: 0.06em;
  height: 0.85em;
  margin-left: 0.04em;
  vertical-align: -0.08em;
  background: currentColor;
  animation: blink 1.05s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.hero-dot {
  display: inline-block;
  width: 0.16em;
  height: 0.16em;
  margin-left: 0.08em;
  border-radius: 50%;
  background: var(--slot-color);
  transition: background-color 0.3s ease;
}

.hero-measure {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
  font-size: 0.9em;
  padding: 0 0.12em;
  text-transform: lowercase;
}

.hero-sub {
  margin-top: clamp(1rem, 2.4vh, 1.6rem);
  max-width: 36ch;
  font-family: var(--font-family);
  font-size: clamp(1rem, 0.9rem + 0.35vw, 1.2rem);
  line-height: 1.55;
  color: var(--paper-dim);
}

.hero-hint {
  display: block;
  color: var(--paper-faint);
}

@media (max-width: 900px) {
  .hero-blank {
    display: block;
  }
}

@media (max-width: 640px) {
  .hero-kicker .sep {
    display: none;
  }

  .hero-place {
    display: block;
    margin-top: 0.4em;
  }
}
</style>
