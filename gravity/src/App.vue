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
let isTouchDrag = false
let gravityRecoveryTimer = null

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

const onPointerDown = (e) => {
  const pt = e.touches ? e.touches[0] : e
  startX = pt.clientX
  startY = pt.clientY
  mouseMoved.value = false
  isTouchDrag = false
}

const onPointerMove = (e) => {
  const pt = e.touches ? e.touches[0] : e
  if (Math.abs(pt.clientX - startX) > 8 || Math.abs(pt.clientY - startY) > 8) {
    mouseMoved.value = true
    isTouchDrag = true
  }
}

const handleWordClick = (word) => {
  if (mouseMoved.value || selectedId.value) return
  router.push(`/${word.id}`)
}

// Touch-specific: tap detection (touchend without drag)
const onTouchEnd = (word, e) => {
  if (!isTouchDrag && !selectedId.value) {
    e.preventDefault()
    router.push(`/${word.id}`)
  }
}

const closeSelection = () => {
  router.push('/')
}

// Use a reliable height for mobile (accounts for address bar)
const getViewportHeight = () => {
  return window.innerHeight
}

const initPhysics = async () => {
  await nextTick()
  if (!containerRef.value) return;

  if (engine) {
    Matter.Engine.clear(engine);
    Matter.Runner.stop(runner);
  }
  
  const width = containerRef.value.clientWidth;
  const height = getViewportHeight();
  
  const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;
        
  engine = Engine.create();
  
  ground = Bodies.rectangle(width / 2, height + 50, width * 3, 100, { isStatic: true });
  // No ceiling — let words fly up freely, gravity brings them back
  const wallLeft = Bodies.rectangle(-50, height / 2, 100, height * 4, { isStatic: true });
  const wallRight = Bodies.rectangle(width + 50, height / 2, 100, height * 4, { isStatic: true });
  
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
      angle: (Math.random() - 0.5) * 1.5, // Random initial rotation
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
    const vw = containerRef.value ? containerRef.value.clientWidth : width;
    const vh = getViewportHeight();

    // Soft rescue zone — only intervene when words are FAR off-screen
    // This lets them fly out naturally and only rescues if truly lost
    const rescueMarginX = vw * 0.5;   // half a viewport width of grace
    const rescueMarginTop = vh * 2;    // 2x viewport height above (lots of room to fly up)
    const rescueMarginBottom = vh * 0.3; // less grace below (should land on ground)

    wordRefs.value.forEach((el, index) => {
      const word = words[index];
      if (word && word.id === selectedId.value) return;

      const body = bodiesMap.get(el);
      if (body && el) {
        const hw = el.offsetWidth / 2;
        const hh = el.offsetHeight / 2;
        let bx = body.position.x;
        let by = body.position.y;
        let rescued = false;

        // Only rescue if truly escaped far beyond viewport
        if (bx < -rescueMarginX) { bx = hw + 20; rescued = true; }
        if (bx > vw + rescueMarginX) { bx = vw - hw - 20; rescued = true; }
        if (by < -rescueMarginTop) { by = -100; rescued = true; } // Place just above screen, let it fall
        if (by > vh + rescueMarginBottom) { by = vh - hh - 20; rescued = true; }

        if (rescued) {
          Matter.Body.setPosition(body, { x: bx, y: by });
          // Give a gentle nudge toward center instead of zeroing velocity
          Matter.Body.setVelocity(body, { x: (vw / 2 - bx) * 0.02, y: 2 });
        }

        const x = body.position.x - hw;
        const y = body.position.y - hh;
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
    const newHeight = getViewportHeight();

    // Update container height to match real viewport
    containerRef.value.style.height = newHeight + 'px';

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

  // Handle Accelerometer / Tilt
  let lastGx = 0;
  let lastGy = 1;

  const handleOrientation = (event) => {
    // Desktop browsers often fire this with null values; return early to save perf
    if (!engine || selectedId.value || event.gamma === null || event.beta === null) return;

    // gamma: left-to-right tilt [-90, 90], beta: front-to-back tilt [-180, 180]
    // Allow full range — words can fly off, soft rescue will catch them
    const gx = Math.max(-1.5, Math.min(1.5, (event.gamma || 0) / 30));
    const gy = Math.max(-1.5, Math.min(1.5, (event.beta || 0) / 30));

    // Only update physics engine if tilt has changed significantly
    if (Math.abs(gx - lastGx) > 0.05 || Math.abs(gy - lastGy) > 0.05) {
      engine.world.gravity.x = gx;
      engine.world.gravity.y = gy;
      lastGx = gx;
      lastGy = gy;

      // Auto-recover gravity to default after tilt stops changing
      clearTimeout(gravityRecoveryTimer);
      gravityRecoveryTimer = setTimeout(() => {
        if (!engine) return;
        // Smoothly ease back to normal gravity
        const easeBack = () => {
          if (!engine) return;
          const cx = engine.world.gravity.x;
          const cy = engine.world.gravity.y;
          const dx = 0 - cx;
          const dy = 1 - cy;
          if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
            engine.world.gravity.x = 0;
            engine.world.gravity.y = 1;
            return;
          }
          engine.world.gravity.x += dx * 0.08;
          engine.world.gravity.y += dy * 0.08;
          requestAnimationFrame(easeBack);
        };
        easeBack();
      }, 2000);
    }
  };

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
  }

  // Prevent pull-to-refresh on iOS Safari (document-level touchmove)
  const preventPullToRefresh = (e) => {
    // Only prevent if at top of page (pull-to-refresh territory)
    if (document.scrollingElement.scrollTop <= 0) {
      e.preventDefault();
    }
  };
  document.addEventListener('touchmove', preventPullToRefresh, { passive: false });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('deviceorientation', handleOrientation);
    document.removeEventListener('touchmove', preventPullToRefresh);
    clearTimeout(gravityRecoveryTimer);
  });
}

onMounted(async () => {
  // Set initial container height for mobile
  if (containerRef.value) {
    containerRef.value.style.height = window.innerHeight + 'px';
  }

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

    <!-- Ambient Background SVG (Dark & Subtle) -->
    <!-- <div class="ambient-bg">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="G1" cx="50%" cy="50%" fx="10%" fy="10%" r="0.6">
            <stop offset="0%" :stop-color="selectedWord?.color || 'var(--accent)'" stop-opacity="0.15" />
            <stop offset="100%" :stop-color="selectedWord?.color || 'var(--accent)'" stop-opacity="0" />
            <animate attributeName="fx" dur="40s" values="0%;10%;0%" repeatCount="indefinite" />
          </radialGradient>
          <radialGradient id="G2" cx="50%" cy="50%" fx="90%" fy="90%" r="0.6">
            <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0" />
            <animate attributeName="fx" dur="30s" values="100%;90%;100%" repeatCount="indefinite" />
          </radialGradient>
          <radialGradient id="G3" cx="50%" cy="50%" fx="50%" fy="50%" r="0.5">
            <stop offset="0%" stop-color="#4c1d95" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#4c1d95" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#G1)">
          <animate attributeName="x" dur="35s" values="-20%;20%;-20%" repeatCount="indefinite" />
          <animate attributeName="y" dur="38s" values="-10%;10%;-10%" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="0" width="100" height="100" fill="url(#G2)">
          <animate attributeName="x" dur="42s" values="20%;-20%;20%" repeatCount="indefinite" />
          <animate attributeName="y" dur="33s" values="10%;-10%;10%" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="0" width="100" height="100" fill="url(#G3)">
          <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="60s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div> -->

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
      @mousedown="onPointerDown"
      @mousemove="onPointerMove"
      @mouseup="handleWordClick(word)"
      @touchstart.passive="onPointerDown"
      @touchmove.passive="onPointerMove"
      @touchend="onTouchEnd(word, $event)"
      :style="{ 
        backgroundImage: word.images && word.images[0] ? `url(${word.images[0].src})` : 'none',
        backgroundColor: word.color || 'transparent',
        fontSize: `clamp(3rem, (3 + ${word.weight * 3}) * 1vw, 9rem)`
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
  height: 100dvh; /* Dynamic viewport height for mobile — fallback above for older browsers */
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background: transparent;
  touch-action: none; /* Prevent browser gestures (pull-to-refresh, scroll bounce) */
  overscroll-behavior: none;
}

.gravity-word {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 900;
  line-height: 0.72;
  padding: 0.13em 0 0 0; /* Fixes top clipping for tight line-height */
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
  transform: translate(6rem, 5rem) rotate(0rad) !important;
  font-size: 10rem !important;
  filter: none; /* Keep the hero title sharp */
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
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
