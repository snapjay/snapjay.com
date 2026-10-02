<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pileWords, findWord } from './data/words'
import WordDetail from './components/WordDetail.vue'
import HeroSentence from './components/HeroSentence.vue'
import PaperTag from './components/PaperTag.vue'
import { usePhysics } from './composables/usePhysics'
import { categoryColors } from './constants'

const route = useRoute()
const router = useRouter()
const containerRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const heroRef = ref<InstanceType<typeof HeroSentence> | null>(null)
const hireRef = ref<HTMLElement | null>(null)
const wordRefs = ref<HTMLElement[]>([])
const mouseMoved = ref(false)

let startX = 0
let startY = 0
let isTouchDrag = false

const selectedId = computed(() => (route.params.id as string) || null)
const selectedWord = computed(() => findWord(selectedId.value))
// Pages without a card in the pile (e.g. Hire Me) open without the fly-in
const selectedInPile = computed(() => pileWords.some(w => w.id === selectedId.value))

const wordLanded = ref(false)

// ── Drag-into-the-blank state ──
const dragIndex = ref<number | null>(null)
const slotOver = ref(false)

// Word currently held over the hero blank (drives the drop highlight)
const dropId = computed(() => {
  if (selectedId.value || !slotOver.value || dragIndex.value === null) return null
  return pileWords[dragIndex.value]?.id ?? null
})

// Bigger roles get bigger paper (and more mass in the physics)
const wordScale = (word: any) => 0.86 + (typeof word.weight === 'number' ? word.weight : 0.5) * 0.34

const handleWordKey = (word: any) => {
  if (selectedId.value) return
  router.push(`/${word.id}`)
}

watch(selectedId, (newId, oldId) => {
  dragIndex.value = null
  slotOver.value = false

  // Any change of page (including page-to-page) starts a fresh fly-in
  if (newId !== oldId) wordLanded.value = false

  // Closing: return focus to whatever opened the page
  if (!newId && oldId) {
    nextTick(() => {
      const index = pileWords.findIndex(w => w.id === oldId)
      if (index !== -1) wordRefs.value[index]?.focus()
      else hireRef.value?.focus()
    })
  }
})

let clickedWord: any = null
let clickStartTime = 0

const onPointerDown = (word: any, e: MouseEvent | TouchEvent) => {
  const pt = 'touches' in e ? e.touches[0] : e
  startX = pt.clientX
  startY = pt.clientY
  mouseMoved.value = false
  isTouchDrag = false
  clickedWord = word
  clickStartTime = Date.now()

  window.addEventListener('mouseup', onGlobalPointerUp)
  window.addEventListener('touchend', onGlobalPointerUp, { passive: false })
}

const onPointerMove = (e: MouseEvent | TouchEvent) => {
  if (!clickedWord) return
  const pt = 'touches' in e ? e.touches[0] : e
  if (Math.abs(pt.clientX - startX) > 8 || Math.abs(pt.clientY - startY) > 8) {
    mouseMoved.value = true
    isTouchDrag = true
  }
}

const onGlobalPointerUp = (e: Event) => {
  window.removeEventListener('mouseup', onGlobalPointerUp)
  window.removeEventListener('touchend', onGlobalPointerUp)

  if (!clickedWord) return

  const clickDuration = Date.now() - clickStartTime
  const moved = mouseMoved.value || isTouchDrag

  if (!moved && clickDuration < 350 && !selectedId.value) {
    if (e.cancelable) e.preventDefault()
    router.push(`/${clickedWord.id}`)
  }

  clickedWord = null
}

const closeSelection = () => {
  router.push('/')
}

const titleLayout = ref({ x: 0, y: 0, width: 0, height: 0 })

const handleModalLayout = (layout: any) => {
  titleLayout.value = layout
}

const isGravityOff = ref(false)

// Initialize physics system
usePhysics(containerRef, particleCanvasRef, wordRefs, selectedId, titleLayout, isGravityOff, {
  getSlotRect: () => (isGravityOff.value ? null : heroRef.value?.getDropRect() ?? null),
  onDragChange: (index) => { dragIndex.value = index },
  onSlotOver: (over) => { slotOver.value = over },
  onSlotDrop: (index) => {
    if (!selectedId.value && pileWords[index]) router.push(`/${pileWords[index].id}`)
  }
})
</script>

<template>
  <div class="chrome-left">
    <a class="tape brand-tape" href="/" :tabindex="selectedId ? -1 : 0" @click.prevent="router.push('/')">snapjay</a>

    <button class="tape gravity-tape" :class="{ 'is-off': isGravityOff }" :aria-pressed="!isGravityOff"
      :aria-label="`Gravity ${isGravityOff ? 'off' : 'on'}`" :tabindex="selectedId ? -1 : 0"
      @click="isGravityOff = !isGravityOff">
      <svg v-if="!isGravityOff" class="gravity-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 2v10M3.5 7.5 8 12l4.5-4.5" />
      </svg>
      <svg v-else class="gravity-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="4.5" />
      </svg>
      <span class="gravity-label">Gravity {{ isGravityOff ? 'off' : 'on' }}</span>
    </button>
  </div>

  <a ref="hireRef" class="tape hire-tape" href="/contact" :tabindex="selectedId ? -1 : 0"
    @click.prevent="router.push('/contact')">
    <span class="hire-dot" aria-hidden="true"></span>
    Available for hire
  </a>

  <div class="gravity-container" ref="containerRef" :style="{
    '--target-x': titleLayout.x ? titleLayout.x + 'px' : '4rem',
    '--target-y': titleLayout.y ? titleLayout.y + 'px' : '6.5rem',
    pointerEvents: selectedId ? 'none' : 'auto',
    touchAction: selectedId ? 'auto' : 'none'
  }">
    <div class="surface" aria-hidden="true">
      <div class="surface-lamp"></div>
      <div class="surface-grain"></div>
      <div class="surface-vignette"></div>
    </div>

    <HeroSentence ref="heroRef" :drop-id="dropId" :hidden="isGravityOff" />

    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- Selected Word Detail View (Teleported to body to escape gravity container) -->
    <Teleport to="body">
      <Transition name="fade">
        <WordDetail v-if="selectedWord" :key="selectedWord.id" :word="selectedWord" :instant="!selectedInPile"
          @close="closeSelection" @landed="wordLanded = true" @layout="handleModalLayout" />
      </Transition>
    </Teleport>

    <div v-for="(word, index) in pileWords" :key="word.id" :ref="el => { if (el) wordRefs[index] = el as HTMLElement }"
      class="gravity-word" :class="{ 'is-selected': selectedId === word.id, 'is-landed': selectedId === word.id && wordLanded }" :tabindex="selectedId ? -1 : 0"
      @mousedown="onPointerDown(word, $event)" @mousemove="onPointerMove"
      @touchstart.passive="onPointerDown(word, $event)" @touchmove.passive="onPointerMove"
      @keydown.enter="handleWordKey(word)" @keydown.space.prevent="handleWordKey(word)" :style="{
        '--word-color': categoryColors[word.category || 'Portfolio'] || '#3592bf',
        '--word-scale': wordScale(word)
      }">
      <div class="paper-shadow">
        <PaperTag :word="word" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gravity-container {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background: var(--surface);
  touch-action: none;
  overscroll-behavior: none;
}

/* ── Workbench surface: texture, overhead lamp, grain, vignette ── */
.surface {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background-color: var(--surface);
  background-image: var(--surface-image);
  background-size: var(--surface-image-size);
  background-position: center;
}

.surface > div {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.surface-lamp {
  background: radial-gradient(ellipse 75% 65% at 30% 28%, var(--lamp) 0%, transparent 70%);
}

.surface-grain {
  opacity: 0.09;
  background-image: url('/textures/grain-surface.webp');
  background-size: 480px;
}

.surface-vignette {
  background: radial-gradient(ellipse 120% 95% at 45% 35%, transparent 45%, rgba(0, 0, 0, 0.6) 100%);
}

.particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

/* ── Site chrome: label-maker tape ── */
.chrome-left {
  position: fixed;
  top: 1.75rem;
  left: clamp(1.25rem, 3vw, 2.25rem);
  z-index: 150;
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.brand-tape {
  --tape-tilt: -2deg;
  font-size: 0.95rem;
  letter-spacing: 0.3em;
  padding-right: 0.85em; /* balance the trailing letter-spacing */
}

.gravity-tape {
  --tape-bg: var(--tape-red);
  --tape-tilt: 1.5deg;
}

.gravity-tape.is-off {
  --tape-bg: var(--tape-black);
}

.gravity-icon {
  width: 0.95em;
  height: 0.95em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.7));
}

/* Call to action: yellow tape, so it reads differently from the black/red controls */
.hire-tape {
  --tape-bg: var(--tape-yellow);
  --tape-tilt: 1.2deg;
  position: fixed;
  top: 1.75rem;
  right: clamp(1.25rem, 3vw, 2.25rem);
  z-index: 150;
  color: var(--tape-yellow-text);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35), 0 -1px 0 rgba(0, 0, 0, 0.25);
}

.hire-tape:hover {
  color: var(--tape-yellow-text);
}

.hire-dot {
  position: relative;
  flex: none;
  width: 0.6em;
  height: 0.6em;
  border-radius: 50%;
  background: #1e9e55;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

/* "Available" pulse: transform + opacity only, so it never repaints */
.hire-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #1e9e55;
  animation: hire-pulse 2.4s ease-out infinite;
}

@keyframes hire-pulse {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  70%,
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hire-dot::after {
    animation: none;
  }
}

@media (max-width: 640px) {
  .chrome-left,
  .hire-tape {
    top: 1rem;
  }

  .chrome-left {
    gap: 0.6rem;
  }

  .brand-tape,
  .gravity-tape,
  .hire-tape {
    font-size: 0.68rem;
  }

  .brand-tape {
    font-size: 0.78rem;
  }

  /* Icon-only gravity toggle on phones; the label stays for screen readers */
  .gravity-tape {
    padding-left: 0.75em;
    padding-right: 0.75em;
  }

  .gravity-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
}

/* ── Paper words ── */
.gravity-word {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  cursor: grab;
  box-sizing: border-box;
  z-index: 10;
  text-transform: uppercase;
  font-size: calc(var(--word-base-size) * var(--word-scale, 1));

  /* One GPU layer per card: physics moves it with a cheap compositor transform */
  will-change: transform;

  /* Retain elevated z-index on close so it doesn't clip under backdrop */
  transition: z-index 0s 0.5s;

  transform: translateY(-1000px);
}

.gravity-word:hover {
  z-index: 100;
  transition: z-index 0s 0s;
}

/* The shadow lives one level inside the moving layer, so it's painted into the
   card's texture once instead of being re-applied by the GPU on every frame.
   Filter on the parent of the clip-path renders a shadow matching the torn shape. */
.paper-shadow {
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.55));
  transition: filter 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.gravity-word:hover .paper-shadow {
  filter: drop-shadow(0 14px 18px rgba(0, 0, 0, 0.6));
  transition: filter 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.gravity-word:hover .paper-tag {
  transform: translateY(-3px) scale(1.03) rotate(-0.5deg);
  background-color: #fbfbfa;
}

.gravity-container.is-resizing .paper-tag {
  transition: none !important;
}

.gravity-word:active {
  cursor: grabbing;
}

.gravity-word.is-selected {
  /* Scale (not font-size, which would relayout every frame) back to the base size
     so it lands exactly on the detail-page title. Scaling happens around the
     centre, so the translate is offset by half the shrink. */
  --s: calc(1 / var(--word-scale, 1));
  transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
    z-index 0s;
  z-index: 1000;
  transform:
    translate(calc(var(--target-x, 4rem) - 50% * (1 - var(--s))), calc(var(--target-y, 6.5rem) - 50% * (1 - var(--s))))
    rotate(0rad)
    scale(var(--s)) !important;
  pointer-events: none;
}

.gravity-word.is-landed {
  opacity: 0 !important;
  transition: opacity 0s !important;
}

.gravity-word:focus-visible {
  outline: 3px solid var(--word-color);
  outline-offset: 4px;
  border-radius: 6px;
}
</style>

<!-- Global styles for Teleported modal transitions -->
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active .title-placeholder {
  opacity: 0 !important;
  transition: none !important;
}
</style>
