<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import words from './words.json'
import WordDetail from './components/WordDetail.vue'
import { usePhysics } from './composables/usePhysics'

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

// Pre-split labels into lines of characters for per-letter rendering
const splitLines = computed(() => words.map(w => {
  return w.label.split(' ').map(word => word.split(''))
}))

const onPointerDown = (e: MouseEvent | TouchEvent) => {
  const pt = 'touches' in e ? e.touches[0] : e
  startX = pt.clientX
  startY = pt.clientY
  mouseMoved.value = false
  isTouchDrag = false
}

const onPointerMove = (e: MouseEvent | TouchEvent) => {
  const pt = 'touches' in e ? e.touches[0] : e
  if (Math.abs(pt.clientX - startX) > 8 || Math.abs(pt.clientY - startY) > 8) {
    mouseMoved.value = true
    isTouchDrag = true
  }
}

const handleWordClick = (word: any) => {
  if (mouseMoved.value || selectedId.value) return
  router.push(`/${word.id}`)
}

// Touch-specific: tap detection (touchend without drag)
const onTouchEnd = (word: any, e: TouchEvent) => {
  if (!isTouchDrag && !selectedId.value) {
    e.preventDefault()
    router.push(`/${word.id}`)
  }
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

// Initialize physics system
usePhysics(containerRef, particleCanvasRef, wordRefs, selectedId, titleLayout)

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
    
    <div class="site-logo" @click="!selectedId && router.push('/contact')">
      <span class="logo-brand">snapjay</span>
      <div class="logo-tagline">
        <span>Engineer + Entrepreneur</span>
        <span class="logo-dot">•</span>
        <span>Knoxville, TN</span>
      </div>
    </div>

    <!-- Selected Word Detail View (Teleported to body to escape gravity container) -->
    <Teleport to="body">
      <Transition name="fade">
        <WordDetail 
          v-if="selectedWord" 
          :word="selectedWord" 
          @close="closeSelection"
          @scroll="handleModalScroll"
          @layout="handleModalLayout"
        />
      </Transition>
    </Teleport>

    <div 
      v-for="(word, index) in words" 
      :key="word.id"
      ref="wordRefs"
      class="gravity-word"
      :class="{ 'is-selected': selectedId === word.id }"
      @mousedown="onPointerDown"
      @mousemove="onPointerMove"
      @mouseup="handleWordClick(word)"
      @touchstart.passive="onPointerDown"
      @touchmove.passive="onPointerMove"
      @touchend="onTouchEnd(word, $event)"
      :style="{ 
        '--word-color': word.color || 'transparent',
        '--word-weight': word.weight || 0.5,
        fontSize: `clamp(1.6rem, (1.6 + ${word.weight * 2}) * 1vw, 5rem)`
      }"
    >
      <span v-for="(line, lineIdx) in splitLines[index]" :key="lineIdx" class="cloth-line">
        <span v-for="(char, ci) in line" :key="ci" class="cloth-letter">{{ char }}</span>
      </span>
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
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(15vw, 10vh) scale(1.1); }
}

@keyframes float2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-10vw, -15vh) scale(1.15); }
}

@keyframes float3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-15vw, 15vh) scale(0.9); }
}

.particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.site-logo {
  position: fixed;
  top: 2.5rem;
  right: 3rem;
  z-index: 10;
  text-align: right;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.site-logo:hover {
  transform: translateY(-2px);
}

.logo-brand {
  font-family: var(--font-family);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  line-height: 1;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 50%, var(--accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.2s;
}

.site-logo:hover .logo-brand {
  opacity: 0.9;
}

.logo-tagline {
  font-family: var(--font-family);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.85;
}

.logo-dot {
  color: var(--accent);
  font-weight: 800;
}

.gravity-word {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 900;
  line-height: 0.82;
  padding: 0.15em 0.375em 0.15em;
  text-transform: uppercase;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: visible;
  text-align: center;
  box-sizing: border-box;
  z-index: 10;
  border-radius: 16px;
  background: rgba(13, 13, 18, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--word-color) 20%, rgba(255, 255, 255, 0.05));
  box-shadow: 
    0 8px 25px -5px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  
  /* Retain elevated z-index on close so it doesn't clip under backdrop */
  transition: z-index 0s 0.5s, 
              filter 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
              background 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease,
              padding 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
              font-size 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
              line-height 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  transform: translateY(-1000px);
}

.gravity-word:hover {
  background: rgba(20, 20, 28, 0.65);
  border-color: color-mix(in srgb, var(--word-color) 50%, rgba(255, 255, 255, 0.15));
  box-shadow: 
    0 15px 35px -5px rgba(0, 0, 0, 0.6),
    0 0 20px -5px color-mix(in srgb, var(--word-color) 35%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  filter: brightness(1.05);
}

.gravity-word:active {
  cursor: grabbing;
}

.cloth-line {
  display: block;
  overflow: visible;
}

.cloth-line + .cloth-line {
  margin-top: -0.1em;
}

.cloth-letter {
  display: inline-block;
  line-height: 0.88;
  background-color: var(--word-color, transparent);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  will-change: transform;
}

.gravity-word.is-selected {
  transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1), 
              color 1s cubic-bezier(0.23, 1, 0.32, 1),
              padding 1s cubic-bezier(0.23, 1, 0.32, 1),
              font-size 1s cubic-bezier(0.23, 1, 0.32, 1),
              line-height 1s cubic-bezier(0.23, 1, 0.32, 1),
              z-index 0s;
  z-index: 1000;
  
  transform: translate(var(--target-x, 4rem), var(--target-y, 6.5rem)) rotate(0rad) !important;
  margin-top: calc(-1 * var(--modal-scroll, 0px));
  
  filter: none;
  pointer-events: none;
  
  /* Morph styles to fit cleanly into header detail text layout */
  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  padding: 0.13em 0 0 0 !important;
  font-size: clamp(3rem, (3 + var(--word-weight) * 3) * 1vw, 9rem) !important;
  line-height: 0.72 !important;
}

@media (max-width: 640px) {
  .site-logo {
    top: 1.5rem;
    right: 1.5rem;
    gap: 0.2rem;
  }
  
  .logo-brand {
    font-size: 1.5rem;
  }
  
  .logo-tagline {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
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
