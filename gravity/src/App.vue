<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Matter from 'matter-js'
import words from './words.json'
import WordDetail from './components/WordDetail.vue'

const route = useRoute()
const router = useRouter()
const containerRef = ref(null)
const particleCanvasRef = ref(null)
const wordRefs = ref([])
const mouseMoved = ref(false)
let engine, runner, ground, bodiesMap, mouseConstraint;
let startX = 0
let startY = 0
let isTouchDrag = false
let gravityRecoveryTimer = null

const selectedId = computed(() => route.params.id || null)
const selectedWord = computed(() => words.find(w => w.id === selectedId.value))

// Pre-split labels into lines of characters for per-letter rendering
const splitLines = computed(() => words.map(w => {
  return w.label.split(' ').map(word => word.split(''))
}))

// Watch for route changes to sync physics state
watch(selectedId, (newId, oldId) => {
  if (newId) {
    // Disable mouse constraint so words can't be dragged behind the modal
    if (mouseConstraint) mouseConstraint.constraint.stiffness = 0
    
    // Temporarily take the selected word's physics body out of play
    bodiesMap?.forEach((body, el) => {
      const index = wordRefs.value.indexOf(el)
      const word = words[index]
      if (word && word.id === newId) {
        Matter.Body.setStatic(body, true)
        // Move it out of bounds so it doesn't block or interact with other words
        Matter.Body.setPosition(body, { x: -1000, y: -1000 })
      }
    })
  } else if (oldId) {
    // Re-enable mouse constraint
    if (mouseConstraint) mouseConstraint.constraint.stiffness = 0.2
    
    // Return the word back to physics
    bodiesMap?.forEach((body, el) => {
      const index = wordRefs.value.indexOf(el)
      const word = words[index]
      if (word && word.id === oldId) {
        Matter.Body.setStatic(body, false)
        
        // Calculate the drop coordinates based on where it visually is
        const targetLeft = titleLayout.value.x || 64
        const targetTop = titleLayout.value.y || 104
        
        Matter.Body.setPosition(body, {
          x: targetLeft + el.offsetWidth / 2,
          y: targetTop + el.offsetHeight / 2
        })
        Matter.Body.setAngle(body, 0)
        Matter.Body.setVelocity(body, { x: 0, y: 1 }) // drop straight down
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
  modalScrollY.value = 0
}

const modalScrollY = ref(0)
const titleLayout = ref({ x: 0, y: 0, width: 0, height: 0 })

const handleModalScroll = (y) => {
  modalScrollY.value = y
}

const handleModalLayout = (layout) => {
  titleLayout.value = layout
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
  
  // --- Particle System for Collisions ---
  let particles = [];
  Matter.Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(pair => {
      const speedA = pair.bodyA.speed || 0;
      const speedB = pair.bodyB.speed || 0;
      const force = speedA + speedB;
      
      // Spawn dust if collision is hard enough
      if (force > 8) {
        const supports = pair.collision.supports;
        if (supports && supports.length > 0) {
          const contact = supports[0];
          const numParticles = Math.min(Math.floor(force / 2), 6); // 4 to 6 puffs
          
          for (let i = 0; i < numParticles; i++) {
            particles.push({
              x: contact.x,
              y: contact.y,
              vx: (Math.random() - 0.5) * force * 0.5,
              vy: (Math.random() - 0.5) * force * 0.5 - Math.random() * 2, // Upward bias
              radius: Math.random() * 2 + 1, // Smaller, sharp particles
              alpha: Math.random() * 0.6 + 0.4, // Less transparent
              decay: Math.random() * 0.04 + 0.02 // Fade faster
            });
          }
        }
      }
    });
  });
  // ------------------------------------
  
  const mouse = Mouse.create(containerRef.value);
  mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
          stiffness: 0.2,
          render: {
              visible: false
          }
      }
  });
  Composite.add(engine.world, mouseConstraint);

  // If modal is already open on init, disable constraint
  if (selectedId.value) mouseConstraint.constraint.stiffness = 0;
  
  runner = Runner.create();
  Runner.run(runner, engine);
  
  const syncLoop = () => {
    const vw = containerRef.value ? containerRef.value.clientWidth : width;
    const vh = getViewportHeight();

    // Render Impact Particles
    const canvas = particleCanvasRef.value;
    if (canvas) {
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
      }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, vw, vh);

      if (particles.length > 0) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          
          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }
          
          ctx.beginPath();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = 'rgba(20, 20, 24, 0.8)'; // Dark, realistic dust
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }
    }

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

        // Cloth ripple: stagger per-letter transforms based on velocity
        const speed = body.speed || 0;
        const letterSpans = el.querySelectorAll('.cloth-letter');
        
        if (speed > 2) {
          const vx = body.velocity.x;
          const vy = body.velocity.y;
          const intensity = Math.min((speed - 2) * 0.8, 10); // Visible displacement on large text
          const time = performance.now() * 0.006; // Wave animation ticker
          
          letterSpans.forEach((span, li) => {
            // Staggered sine wave — each letter offset by its index
            const phase = li * 0.5 + time;
            const yOffset = Math.sin(phase) * intensity;
            const rot = Math.sin(phase + 0.4) * intensity * 0.6; // Slight rotation
            span.style.transform = `translateY(${yOffset}px) rotate(${rot}deg)`;
          });
        } else {
          // At rest: snap all letters back to natural position
          letterSpans.forEach(span => {
            if (span.style.transform) span.style.transform = '';
          });
        }
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
      const originalTransition = el.style.transition;
      const originalTransform = el.style.transform;
      const wasSelected = el.classList.contains('is-selected');
      
      // Temporarily remove selection and transitions to measure TRUE natural size
      el.style.transition = 'none';
      if (wasSelected) el.classList.remove('is-selected');
      el.style.transform = 'none';
      
      const newW = el.offsetWidth;
      const newH = el.offsetHeight;
      
      // Restore states
      if (wasSelected) el.classList.add('is-selected');
      el.style.transition = originalTransition;
      el.style.transform = originalTransform;
      
      if (body.prevWidth && body.prevHeight && newW > 0 && newH > 0) {
        const scaleX = newW / body.prevWidth;
        const scaleY = newH / body.prevHeight;
        Matter.Body.scale(body, scaleX, scaleY);
        body.prevWidth = newW;
        body.prevHeight = newH;
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
