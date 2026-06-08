<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import words from './words.json'
import WordDetail from './components/WordDetail.vue'
import { usePhysics } from './composables/usePhysics'
import { categoryColors, fontFamilies } from './constants'

const paperBgs = [
  '/paper/240_F_1868267006_OpY942D4rtZ6nbxuAqSbbqKfglKpuh0a.jpg',
  '/paper/240_F_1984490889_qbr6AJvykYEg8jFDm6f8N15cAPvnmbSQ.jpg',
  '/paper/240_F_2009359561_8u5uAmCszlfeQQGETVz8dOER8jVkIBzy.jpg',
  '/paper/240_F_261261445_elk4rgJ9pnofaTj78Xw1tKsQlCVGbmu6.jpg',
  '/paper/240_F_312312418_uyrEv9Mq4zbL0Sdi0fA5xnDAukpypE9a.jpg',
  '/paper/240_F_444013321_vzwRWzfmRQNlCFwYJmMaqssq6HuKENuf.jpg',
  '/paper/240_F_470922875_gKHd4c5VjOkquYNcN2FjUTVzv9jEE6E7.jpg',
  '/paper/360_F_1885679285_lN5T3BazdzdvSFjgNFHr7wWjDxqdAwyX.jpg',
  '/paper/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcHg2NTA4NDctaW1hZ2Utam9iNjMwLWctbDBnMDlscTUuanBn.webp'
]

const route = useRoute()
const router = useRouter()
const containerRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const wordRefs = ref<HTMLElement[]>([])
const mouseMoved = ref(false)

let startX = 0
let startY = 0
let isTouchDrag = false

const selectedId = computed(() => (route.params.id as string) || null)
const selectedWord = computed(() => words.find(w => w.id === selectedId.value))

const handleWordKey = (word: any) => {
  if (selectedId.value) return
  router.push(`/${word.id}`)
}

watch(selectedId, (newId, oldId) => {
  if (!newId && oldId) {
    const index = words.findIndex(w => w.id === oldId)
    if (index !== -1 && wordRefs.value[index]) {
      nextTick(() => {
        wordRefs.value[index]?.focus()
      })
    }
  }
})

// Pre-split labels into lines of characters for per-letter rendering
const splitLines = computed(() => words.map(w => {
  return w.label.split(' ').map(word => word.split(''))
}))

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
  modalScrollY.value = 0
}

const modalScrollY = ref(0)
const titleLayout = ref({ x: 0, y: 0, width: 0, height: 0 })

const handleModalScroll = (y: number) => {
  modalScrollY.value = y
}

const handleModalLayout = (layout: any) => {
  titleLayout.value = layout
}

const isGravityOff = ref(false)

// Initialize physics system
usePhysics(containerRef, particleCanvasRef, wordRefs, selectedId, titleLayout, isGravityOff)

</script>

<template>
  <div class="gravity-container" ref="containerRef" :style="{
    '--modal-scroll': modalScrollY + 'px',
    '--target-x': titleLayout.x ? titleLayout.x + 'px' : '4rem',
    '--target-y': titleLayout.y ? titleLayout.y + 'px' : '6.5rem'
  }">
    <div class="ambient-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <button class="gravity-toggle-btn" :class="{ 'is-active': isGravityOff }" :tabindex="selectedId ? -1 : 0"
      @click="isGravityOff = !isGravityOff" aria-label="Toggle gravity mode">
      <span class="toggle-track">
        <span class="toggle-knob"></span>
      </span>
      <span class="toggle-label">{{ isGravityOff ? 'Zero Gravity' : 'Gravity On' }}</span>
    </button>

    <div class="site-logo" :tabindex="selectedId ? -1 : 0" @click="!selectedId && router.push('/contact')"
      @keydown.enter="!selectedId && router.push('/contact')"
      @keydown.space.prevent="!selectedId && router.push('/contact')">
      <h1>snapjay</h1>
      <h2>Engineer+Entrepreneur </h2>
      <h1> Knoxville, TN</h1>
    </div>

    <!-- Selected Word Detail View (Teleported to body to escape gravity container) -->
    <Teleport to="body">
      <Transition name="fade">
        <WordDetail v-if="selectedWord" :word="selectedWord" @close="closeSelection" @scroll="handleModalScroll"
          @layout="handleModalLayout" />
      </Transition>
    </Teleport>

    <div v-for="(word, index) in words" :key="word.id" :ref="el => { if (el) wordRefs[index] = el as HTMLElement }"
      class="gravity-word" :class="{ 'is-selected': selectedId === word.id }" :tabindex="selectedId ? -1 : 0"
      @mousedown="onPointerDown(word, $event)" @mousemove="onPointerMove"
      @touchstart.passive="onPointerDown(word, $event)" @touchmove.passive="onPointerMove"
      @keydown.enter="handleWordKey(word)" @keydown.space.prevent="handleWordKey(word)" :style="{
        '--word-color': categoryColors[word.category || 'Portfolio'] || '#3592bf',
        '--word-weight': 0.5, // Ignore word.weight to keep all sizes the same
        fontSize: `clamp(1.6rem, 1.5vw + 1.5vh, 4.5rem)`
      }">
      <div class="paper-tag" :class="'paper-torn-' + (index % 4 + 1)" :style="{
        '--paper-bg-url': `url(${paperBgs[index % paperBgs.length]})`,
        fontFamily: fontFamilies[word.font] || fontFamilies['moms-typewriter'],
        fontWeight: (word.font === 'playfair-display') ? '900' : 'normal'
      }">
        <span class="paper-text">
          <span v-for="(line, lineIdx) in splitLines[index]" :key="lineIdx" class="cloth-line">
            <span v-for="(char, ci) in line" :key="ci" class="cloth-letter">{{ char }}</span>
            <span v-if="lineIdx === splitLines[index].length - 1" class="paper-dot"></span>
          </span>
        </span>
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
  background: var(--bg-primary);
  touch-action: none;
  overscroll-behavior: none;
}

.ambient-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--bg-primary);
}

.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.18;
  filter: blur(130px);
  mix-blend-mode: screen;
}

.orb-1 {
  width: 70vw;
  height: 70vh;
  background: radial-gradient(circle, rgba(53, 146, 191, 0.45) 0%, rgba(53, 146, 191, 0) 70%);
  top: -10vh;
  left: -10vw;
  animation: float1 25s infinite ease-in-out alternate;
}

.orb-2 {
  width: 85vw;
  height: 85vh;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(124, 58, 237, 0) 70%);
  bottom: -20vh;
  right: -10vw;
  animation: float2 30s infinite ease-in-out alternate-reverse;
}

.orb-3 {
  width: 65vw;
  height: 65vh;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, rgba(13, 148, 136, 0) 70%);
  top: 30vh;
  left: 20vw;
  animation: float3 35s infinite ease-in-out alternate;
}

@keyframes float1 {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(15vw, 10vh) scale(1.1);
  }
}

@keyframes float2 {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(-10vw, -15vh) scale(1.15);
  }
}

@keyframes float3 {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(-15vw, 15vh) scale(0.9);
  }
}

.particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.site-logo {
  position: fixed;
  top: 2rem;
  right: 2rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: var(--accent);
  z-index: 10;
  /* Behind the modal backdrop */
  text-align: right;
  line-height: 0.8;
  opacity: 0.8;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.2s;
}

.site-logo:hover {
  opacity: 1;
}

.site-logo h1 {
  display: inline-block;
  font-size: clamp(1.5rem, 4vw, 3rem);
  margin: 0 1rem;
}

.site-logo h2 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: #fff;
  display: inline-block;
}

.gravity-word {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
  z-index: 10;
  text-transform: uppercase;

  /* Parent filter renders shadow matching the clipped child shape */
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.45));

  /* Retain elevated z-index on close so it doesn't clip under backdrop */
  transition: z-index 0s 0.5s,
    filter 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);

  transform: translateY(-1000px);
}

.gravity-word:hover {
  filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.55));
}

.paper-tag {
  background-color: #f5f4ed;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E"),
    var(--paper-bg-url, none);
  background-size: auto, cover;
  background-position: center;
  background-repeat: repeat, no-repeat;
  padding: 0.35em 0.85em 0.3em;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.05em;

  font-family: 'Moms Typewriter', 'Courier New', Courier, monospace;
  font-weight: normal;
  line-height: 0.95;
  text-transform: lowercase;

  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.3s ease,
    padding 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
    font-size 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
    line-height 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.gravity-word:hover .paper-tag {
  transform: translateY(-3px) scale(1.03) rotate(-0.5deg);
  background-color: #fbfbfa;
}

.gravity-word:active {
  cursor: grabbing;
}

/* Four randomized jagged clip-path variations for authentic torn edges */
.paper-torn-1 {
  clip-path: polygon(0.5% 3%, 12% 1.5%, 28% 4%, 42% 1.2%, 58% 3.5%, 72% 1.8%, 88% 4.2%, 99% 2%,
      98% 18%, 99.5% 38%, 98.2% 58%, 99.1% 78%, 98.5% 97%,
      86% 98.5%, 74% 96.5%, 58% 99%, 44% 97.2%, 28% 98.8%, 14% 96.2%, 1% 98%,
      1.8% 82%, 0.5% 62%, 1.2% 42%, 0.8% 22%);
}

.paper-torn-2 {
  clip-path: polygon(1.5% 2%, 18% 3.5%, 32% 1.2%, 48% 4.1%, 64% 1.8%, 82% 3.2%, 98.5% 1.5%,
      97.5% 22%, 99% 45%, 97.8% 68%, 99.2% 96.5%,
      88% 95.2%, 72% 97.8%, 56% 95.8%, 38% 98.2%, 22% 95.5%, 1.2% 97.2%,
      0.8% 76%, 2% 52%, 0.5% 28%);
}

.paper-torn-3 {
  clip-path: polygon(0.8% 4%, 15% 1.8%, 35% 3.2%, 55% 1.5%, 75% 3.8%, 92% 2.1%, 99.2% 3.5%,
      98.1% 28%, 99% 48%, 97.5% 72%, 98.8% 98%,
      82% 97.1%, 64% 98.8%, 46% 96.5%, 28% 98.2%, 12% 96.8%, 1.5% 97.5%,
      1.2% 78%, 0.5% 58%, 1.8% 32%);
}

.paper-torn-4 {
  clip-path: polygon(1.2% 1.8%, 22% 3.2%, 42% 1.5%, 62% 3.8%, 82% 2.1%, 98.8% 3.2%,
      97.5% 18%, 99.1% 42%, 97.8% 68%, 99.2% 97.8%,
      84% 96.8%, 68% 98.5%, 52% 96.2%, 36% 98.8%, 18% 97.2%, 0.8% 96.2%,
      1.5% 72%, 0.8% 48%, 2.1% 24%);
}

.cloth-line {
  display: block;
  overflow: visible;
}

.cloth-line+.cloth-line {
  margin-top: -0.05em;
}

.cloth-letter {
  display: inline-block;
  line-height: 0.88;
  /* Dark typewriter ink style on the homepage */
  background-color: #1c1c1f;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  will-change: transform;
}

.paper-dot {
  display: inline-block;
  width: 0.24em;
  height: 0.24em;
  border-radius: 50%;
  background-color: currentColor;
  color: var(--word-color);
  margin-left: 0.08em;
  vertical-align: baseline;
}

.gravity-word.is-selected {
  transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
    z-index 0s;
  z-index: 1000;
  transform: translate(var(--target-x, 4rem), var(--target-y, 6.5rem)) rotate(0rad) !important;
  margin-top: calc(-1 * var(--modal-scroll, 0px));
  pointer-events: none;
}

.gravity-word.is-selected .paper-tag {
  line-height: 0.95 !important;

  transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
    padding 1s cubic-bezier(0.23, 1, 0.32, 1),
    font-size 1s cubic-bezier(0.23, 1, 0.32, 1),
    line-height 1s cubic-bezier(0.23, 1, 0.32, 1);
}

.gravity-word:focus-visible {
  outline: 3px solid var(--word-color);
  outline-offset: 4px;
  border-radius: 6px;
}

.site-logo:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: 4px;
}

@media (max-width: 640px) {
  /* Placeholder for any future mobile overrides that don't include font-size */
}

.gravity-toggle-btn {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 30px;
  padding: 0.6rem 1.1rem;
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  user-select: none;
}

.gravity-toggle-btn:hover {
  background: rgba(20, 20, 28, 0.85);
  border-color: rgba(53, 146, 191, 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(53, 146, 191, 0.25);
}

.gravity-toggle-btn:active {
  transform: translateY(0);
}

.toggle-track {
  position: relative;
  width: 38px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.gravity-toggle-btn:hover .toggle-track {
  background: rgba(255, 255, 255, 0.15);
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: var(--text-secondary);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-label {
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

/* Active State */
.gravity-toggle-btn.is-active {
  border-color: rgba(53, 146, 191, 0.5);
}

.gravity-toggle-btn.is-active .toggle-track {
  background: rgba(53, 146, 191, 0.25);
  border-color: rgba(53, 146, 191, 0.3);
}

.gravity-toggle-btn.is-active .toggle-knob {
  transform: translateX(18px);
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

.gravity-toggle-btn.is-active .toggle-label {
  color: var(--accent);
  text-shadow: 0 0 10px rgba(53, 146, 191, 0.3);
}

.gravity-toggle-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

@media (max-width: 900px) {
  .gravity-toggle-btn {
    top: 1rem;
    left: 1rem;
    bottom: auto;
    transform: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), var(--shadow-glow);
  }

  .gravity-toggle-btn:hover {
    transform: translateY(-2px);
  }

  .gravity-toggle-btn:active {
    transform: translateY(0);
  }
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
</style>
