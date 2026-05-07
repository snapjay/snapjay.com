<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import Matter from 'matter-js'
import words from './words.json'

const containerRef = ref(null)
const wordRefs = ref([])
const selectedId = ref(null)
const mouseMoved = ref(false)
let engine, runner, ground, bodiesMap;
let startX = 0
let startY = 0

const selectedWord = computed(() => words.find(w => w.id === selectedId.value))

const onMouseDown = (e) => {
  startX = e.clientX
  startY = e.clientY
  mouseMoved.value = false
}

const onMouseMove = (e) => {
  if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
    mouseMoved.value = true
  }
}

const handleWordClick = (word) => {
  if (mouseMoved.value || selectedId.value) return
  selectedId.value = word.id
  
  if (ground) {
    ground.isSensor = true; // Let them fall through
  }
}

const closeSelection = () => {
  const lastId = selectedId.value
  selectedId.value = null
  
  if (ground) {
    ground.isSensor = false;
  }

  // ONLY return the selected word back to the physics engine
  bodiesMap.forEach((body, el) => {
    const index = wordRefs.value.indexOf(el);
    const word = words[index];
    
    if (word && word.id === lastId) {
      // Selected word falls from its "page title" position (approx 2rem, 2rem)
      Matter.Body.setPosition(body, {
        x: 32 + el.offsetWidth / 2,
        y: 32 + el.offsetHeight / 2
      });
      Matter.Body.setAngle(body, 0);
      Matter.Body.setVelocity(body, { x: 1, y: 2 });
    }
    // All other bodies stay where they are (likely off-screen)
  });
}

const initPhysics = async () => {
  await nextTick()
  if (!containerRef.value) return;

  if (engine) {
    Matter.Engine.clear(engine);
    Matter.Runner.stop(runner);
  }
  
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight || 800;
  
  const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;
        
  engine = Engine.create();
  
  ground = Bodies.rectangle(width / 2, height + 50, width * 2, 100, { isStatic: true });
  const wallLeft = Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true });
  const wallRight = Bodies.rectangle(width + 50, height / 2, 100, height * 2, { isStatic: true });
  
  Composite.add(engine.world, [ground, wallLeft, wallRight]);
  
  bodiesMap = new Map();
  
  wordRefs.value.forEach((el, index) => {
    if (!el) return;
    
    // IMPORTANT: Reset transform before measuring
    const originalTransform = el.style.transform;
    el.style.transform = 'none';
    
    const rect = { width: el.offsetWidth, height: el.offsetHeight };
    const startX = Math.random() * (width - rect.width) + rect.width / 2;
    const startY = -Math.random() * 800 - 200;
    
    const body = Bodies.rectangle(startX, startY, rect.width, rect.height, {
      restitution: 0.5,
      friction: 0.1,
      chamfer: { radius: 4 }, // Smaller chamfer for tighter fit
      render: { visible: false }
    });
    
    // Restore transform (will be overridden by syncLoop anyway)
    el.style.transform = originalTransform;
    
    Composite.add(engine.world, body);
    bodiesMap.set(el, body);
  });
  
  const mouse = Mouse.create(containerRef.value);
  const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
          stiffness: 0.2,
          render: {
              visible: false
          }
      }
  });
  Composite.add(engine.world, mouseConstraint);
  
  runner = Runner.create();
  Runner.run(runner, engine);
  
  const syncLoop = () => {
    wordRefs.value.forEach((el, index) => {
      const word = words[index];
      if (word && word.id === selectedId.value) return;

      const body = bodiesMap.get(el);
      if (body && el) {
        const x = body.position.x - el.offsetWidth / 2;
        const y = body.position.y - el.offsetHeight / 2;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      }
    });
    requestAnimationFrame(syncLoop);
  };
  syncLoop();
}

onMounted(() => {
  initPhysics()
});

onUnmounted(() => {
  if (runner) Matter.Runner.stop(runner);
  if (engine) Matter.Engine.clear(engine);
});


</script>

<template>
  <div class="gravity-container" ref="containerRef">
    <!-- Selected View Background Image -->
    <Transition name="fade">
      <div v-if="selectedWord" class="selected-overlay">
        <div class="page-container">
          <aside class="page-sidebar">
            <div class="image-frame">
              <img :src="selectedWord.image" :alt="selectedWord.label" class="detail-image" />
            </div>
            <div class="word-stats">
              <div class="stat-item">
                <span class="stat-label">Intensity</span>
                <div class="stat-bar"><div class="stat-fill" :style="{ width: (selectedWord.weight * 100) + '%' }"></div></div>
              </div>
            </div>
          </aside>
          
          <main class="page-main">
            <header class="content-header">
              <span class="category-tag">Featured Role</span>
              <h1 class="content-title">{{ selectedWord.label }}</h1>
            </header>
            
            <div class="content-body">
              <p class="lead-text">
                Exploring the intersection of creativity and impact through the lens of {{ selectedWord.label.replace('\n', ' ') }}.
              </p>
              <p>
                This role embodies the core values of our gravity-based design philosophy. Every interaction is calculated, every collision intentional. In the world of physics-based typography, {{ selectedWord.label.replace('\n', ' ') }} stands out as a high-weight component that anchors the visual experience.
              </p>
              <div class="content-grid">
                <div class="grid-card">
                  <h3>Dynamics</h3>
                  <p>Simulating realistic weight and momentum to create tactile digital interfaces.</p>
                </div>
                <div class="grid-card">
                  <h3>Impact</h3>
                  <p>How typography influences user perception through movement and physics.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        <button class="close-btn" @click="closeSelection">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </Transition>

    <div 
      v-for="(word, index) in words" 
      :key="word.id"
      ref="wordRefs"
      class="gravity-word"
      :class="{ 'is-selected': selectedId === word.id }"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="handleWordClick(word)"
      :style="{ 
        backgroundImage: `url(${word.image})`,
        fontSize: `${3.5 + (word.weight * 4.5)}rem` 
      }"
    >
      {{ word.label }}
    </div>
  </div>
</template>

<style scoped>
.gravity-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background: transparent;
}

.gravity-word {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 900;
  line-height: 0.85;
  padding: 0;
  text-transform: uppercase;
  background-size: cover;
  background-position: center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  
  user-select: none;
  cursor: grab;
  white-space: pre-line;
  text-align: center;
  box-sizing: border-box;
  
  /* Start off-screen */
  transform: translateY(-1000px);
}

.gravity-word:active {
  cursor: grabbing;
}

.gravity-word.is-selected {
  transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1000;
  transform: translate(2rem, 2rem) rotate(0rad) !important;
  pointer-events: none;
}

/* Selected Overlay Styles */
.selected-overlay {
  position: absolute;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 12, 0.9);
  backdrop-filter: blur(20px);
}

.page-container {
  width: 90%;
  max-width: 1200px;
  height: 85%;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 4rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 3rem;
  padding: 4rem;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.4);
}

.page-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-frame {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid var(--border-highlight);
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.word-stats {
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 1.5rem;
  border: 1px solid var(--border-subtle);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.stat-bar {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  box-shadow: 0 0 15px var(--accent);
}

.page-main {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  overflow-y: auto;
  padding-right: 1rem;
}

/* Custom Scrollbar */
.page-main::-webkit-scrollbar {
  width: 6px;
}
.page-main::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 3px;
}

.category-tag {
  font-family: 'Outfit', sans-serif;
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.9rem;
}

.content-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 6rem;
  line-height: 0.9;
  margin: 0.5rem 0 0;
  white-space: pre-line;
  background: linear-gradient(to bottom, #fff, #888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Outfit', sans-serif;
  line-height: 1.7;
  color: rgba(255,255,255,0.8);
  font-size: 1.1rem;
}

.lead-text {
  font-size: 1.4rem;
  color: #fff;
  font-weight: 500;
  line-height: 1.5;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.grid-card {
  padding: 2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 1.5rem;
}

.grid-card h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.grid-card p {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.7;
}

.close-btn {
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-highlight);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1100;
}

.close-btn:hover {
  transform: scale(1.1) rotate(90deg);
  background: var(--accent);
  border-color: white;
}

.close-btn svg {
  width: 1.8rem;
  height: 1.8rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
