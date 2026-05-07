<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Matter from 'matter-js'
import words from './words.json'
import WordDetail from './components/WordDetail.vue'

const route = useRoute()
const router = useRouter()
const containerRef = ref(null)
const wordRefs = ref([])
const mouseMoved = ref(false)
let engine, runner, ground, bodiesMap;
let startX = 0
let startY = 0

const selectedId = computed(() => route.params.id || null)
const selectedWord = computed(() => words.find(w => w.id === selectedId.value))

// Watch for route changes to sync physics state
watch(selectedId, (newId, oldId) => {
  if (newId) {
    if (ground) ground.isSensor = true
  } else if (oldId) {
    if (ground) ground.isSensor = false
    
    // Return the word back to physics
    bodiesMap?.forEach((body, el) => {
      const index = wordRefs.value.indexOf(el)
      const word = words[index]
      if (word && word.id === oldId) {
        Matter.Body.setPosition(body, {
          x: 32 + el.offsetWidth / 2,
          y: 32 + el.offsetHeight / 2
        })
        Matter.Body.setAngle(body, 0)
        Matter.Body.setVelocity(body, { x: 1, y: 2 })
      }
    })
  }
}, { immediate: true })

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
  router.push(`/${word.id}`)
}

const closeSelection = () => {
  router.push('/')
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
    
    body.prevWidth = rect.width;
    body.prevHeight = rect.height;
    
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

  // Handle Resize
  const handleResize = () => {
    if (!containerRef.value) return;
    const newWidth = containerRef.value.clientWidth;
    const newHeight = containerRef.value.clientHeight || 800;

    Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 });
    Matter.Body.setPosition(wallLeft, { x: -50, y: newHeight / 2 });
    Matter.Body.setPosition(wallRight, { x: newWidth + 50, y: newHeight / 2 });

    // Re-measure words and scale bodies
    bodiesMap.forEach((body, el) => {
      if (!el || !body) return;
      const originalTransform = el.style.transform;
      el.style.transform = 'none';
      
      const newW = el.offsetWidth;
      const newH = el.offsetHeight;
      
      if (body.prevWidth && body.prevHeight) {
        const scaleX = newW / body.prevWidth;
        const scaleY = newH / body.prevHeight;
        Matter.Body.scale(body, scaleX, scaleY);
      }
      
      // Safety Nudge: If the window shrank, push words back into the new viewport
      const padding = 40;
      let targetX = body.position.x;
      let targetY = body.position.y;

      if (targetX < padding) targetX = padding + newW/2;
      if (targetX > newWidth - padding) targetX = newWidth - padding - newW/2;
      if (targetY > newHeight - padding) targetY = newHeight - padding - newH/2;

      if (targetX !== body.position.x || targetY !== body.position.y) {
        Matter.Body.setPosition(body, { x: targetX, y: targetY });
        Matter.Body.setVelocity(body, { x: 0, y: 1 }); // Gentle drop
      }
      
      body.prevWidth = newW;
      body.prevHeight = newH;
      el.style.transform = originalTransform;
    });
  };
  window.addEventListener('resize', handleResize);
  onUnmounted(() => window.removeEventListener('resize', handleResize));
}

onMounted(async () => {
  // Wait for Bebas Neue to load before measuring for physics
  if (document.fonts) {
    try {
      await document.fonts.load('900 1rem "Bebas Neue"')
      await document.fonts.ready
    } catch (e) {
      console.warn('Font loading timed out or failed, proceeding with fallback metrics')
    }
  }
  
  // Extra tick to ensure layout has settled
  await nextTick()
  setTimeout(initPhysics, 200)
});

onUnmounted(() => {
  if (runner) Matter.Runner.stop(runner);
  if (engine) Matter.Engine.clear(engine);
});


</script>

<template>
  <div class="gravity-container" ref="containerRef">
    <!-- Selected Word Detail View -->
    <Transition name="fade">
      <WordDetail 
        v-if="selectedWord" 
        :word="selectedWord" 
        @close="closeSelection"
      />
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
        backgroundImage: word.images && word.images[0] ? `url(${word.images[0].src})` : 'none',
        backgroundColor: word.color || 'transparent',
        fontSize: `clamp(1.5rem, (3 + ${word.weight * 3}) * 1vw, 9rem)`
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
