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
      <h1>snapjay</h1><h2>Engineer+Entrepreneur </h2><h1> Knoxville, TN</h1>
    
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
        // backgroundImage: word.images && word.images[0] ? `url(${word.images[0].src})` : 'none',
        '--word-color': word.color || 'transparent',
        fontSize: `clamp(3rem, (3 + ${word.weight * 3}) * 1vw, 9rem)`
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
  height: 100dvh; /* Dynamic viewport height for mobile — fallback above for older browsers */
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background: transparent;
  touch-action: none; /* Prevent browser gestures (pull-to-refresh, scroll bounce) */
  overscroll-behavior: none;
}

.ambient-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #c5cccd;
  /* Cycles from blueish daylight through pinks to warm sunset orange */
  animation: day-night-cycle 40s infinite alternate linear;
}

@keyframes day-night-cycle {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(170deg); }
}

.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.9;
}

/* Uses rgba so the edges fade out smoothly without expensive CSS blur */
.orb-1 {
  width: 120vw;
  height: 120vh;
  background: radial-gradient(circle, rgba(181, 217, 241, 0.8) 0%, rgba(181, 217, 241, 0) 60%);
  top: -30vh;
  left: -20vw;
  animation: float1 25s infinite ease-in-out alternate;
}

.orb-2 {
  width: 140vw;
  height: 140vh;
  background: radial-gradient(circle, rgba(161, 200, 230, 0.8) 0%, rgba(161, 200, 230, 0) 60%);
  bottom: -40vh;
  right: -30vw;
  animation: float2 30s infinite ease-in-out alternate-reverse;
}

.orb-3 {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, rgba(208, 228, 245, 0.5) 0%, rgba(208, 228, 245, 0) 60%);
  top: 20vh;
  left: 20vw;
  animation: float3 35s infinite ease-in-out alternate;
}

@keyframes float1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(25vw, 15vh) scale(1.1); }
}

@keyframes float2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-15vw, -20vh) scale(1.15); }
}

@keyframes float3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-20vw, 20vh) scale(0.9); }
}

.particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 5; /* Above background, behind words */
  pointer-events: none;
}

.site-logo {
  position: fixed;
  top: 2rem;
  right: 2rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: var(--accent);
  z-index: 10; /* Behind the modal backdrop */
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

.site-logo h1{
  display: inline-block;
  font-size: clamp(1.5rem, 4vw, 3rem);
  margin:0 1rem;
}
.site-logo h2{
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: rgb(0, 0, 0);
  display: inline-block;
}

.gravity-word {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 900;
  line-height: .86;
  padding: 0;
  text-transform: uppercase;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: visible; /* Prevent line-height clipping on inline-block letter spans */
  text-align: left;
  box-sizing: border-box;
  z-index: 10;
  /* Keep z-index elevated for 0.5s on close so it doesn't fall behind the fading modal backdrop */
  transition: z-index 0s 0.5s, filter 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  /* text-shadow: 0 10px 30px rgba(0,0,0,0.5); */
  
  /* Start off-screen */
  transform: translateY(-1000px);
}

.gravity-word:hover {
  filter: brightness(0.75) drop-shadow(0 0 15px rgba(255, 255, 255, 0.15));
}

.gravity-word:active {
  cursor: grabbing;
}

.cloth-line {
  display: block;
  overflow: visible; /* Prevent glyph clipping at line level */
}

.cloth-line + .cloth-line {
  margin-top: -0.18em; /* Pull second line up — pixel-perfect control */
}

.cloth-letter {
  display: inline-block;
  line-height: 0.88; /* Tight around glyphs — overflow:visible on parent prevents clipping */
  background-color: var(--word-color, transparent);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  will-change: transform;
}

.gravity-word.is-selected {
  /* Animate transform for the fly-in */
  transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1), 
              color 1s cubic-bezier(0.23, 1, 0.32, 1),
              z-index 0s;
  z-index: 1000;
  
  /* Target the absolute placeholder position */
  transform: translate(var(--target-x, 4rem), var(--target-y, 6.5rem)) rotate(0rad) !important;
  
  /* Instant scroll sync without transition delay */
  margin-top: calc(-1 * var(--modal-scroll, 0px));
  
  filter: none;
  pointer-events: none;
}

@media (max-width: 640px) {
  /* Placeholder for any future mobile overrides that don't include font-size */
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
