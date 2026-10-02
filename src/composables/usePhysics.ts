import { watch, onMounted, onUnmounted, nextTick, Ref } from 'vue';
import Matter from 'matter-js';
import { pileWords as words } from '../data/words';

export interface PhysicsHooks {
  /** Viewport rect of the hero blank that words can be dropped into */
  getSlotRect?: () => DOMRect | null;
  /** Fires with the index of the word being dragged, or null when released */
  onDragChange?: (index: number | null) => void;
  /** Fires when a dragged word enters or leaves the blank */
  onSlotOver?: (over: boolean) => void;
  /** Fires when a word is released over the blank */
  onSlotDrop?: (index: number) => void;
}

// Paper, not rubber: barely bounces, grips other paper, and falls against air drag
const PAPER = {
  restitution: 0.12,
  friction: 0.45,
  frictionStatic: 0.9,
  frictionAir: 0.028,
};
const SLOT_HIT_MARGIN = 48;

interface TitleLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function usePhysics(
  containerRef: Ref<HTMLElement | null>,
  particleCanvasRef: Ref<HTMLCanvasElement | null>,
  wordRefs: Ref<HTMLElement[]>,
  selectedId: Ref<string | null>,
  titleLayout: Ref<TitleLayout>,
  isGravityOff: Ref<boolean>,
  hooks: PhysicsHooks = {}
) {
  let engine: Matter.Engine;
  let ground: Matter.Body;
  let wallLeft: Matter.Body;
  let wallRight: Matter.Body;
  let bodiesMap: Map<HTMLElement, Matter.Body> | undefined;
  let mouseConstraint: Matter.MouseConstraint | undefined;
  let gravityRecoveryTimer: ReturnType<typeof setTimeout> | null = null;
  let particles: any[] = [];
  let lastWidth = 0;
  let lastHeight = 0;
  let floatTime = 0;
  let rafId = 0;
  let lastTimestamp = 0;
  let droppedFramesScore = 0;
  let explosionsEnabled = true;
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  let overSlot = false;

  // Sleep detection — skip physics when bodies are settled
  let isSleeping = false;
  let sleepFrames = 0;
  const SLEEP_SPEED_THRESHOLD = 0.8;
  const SLEEP_FRAME_COUNT = 120; // ~2 seconds at 60fps

  const wakeEngine = () => {
    isSleeping = false;
    sleepFrames = 0;
  };

  interface TargetPosition {
    x: number;
    y: number;
  }
  let targetPositions: TargetPosition[] = [];

  const updateGridTargets = () => {
    if (!containerRef.value) return;
    const W = containerRef.value.clientWidth;
    const H = getViewportHeight();
    const numWords = wordRefs.value.length;
    if (numWords === 0) return;

    let cols = 5;
    if (W < 600) {
      cols = 2;
    } else if (W < 900) {
      cols = 3;
    } else if (W < 1300) {
      cols = 4;
    } else {
      cols = 5;
    }
    const rows = Math.ceil(numWords / cols);

    const paddingX = Math.max(30, W * 0.06);
    const paddingY = Math.max(50, H * 0.08);
    
    const availableWidth = W - paddingX * 2;
    const availableHeight = H - paddingY * 2;
    
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;

    const sortedIndices = Array.from({ length: numWords }, (_, i) => i).sort((a, b) => {
      const labelA = words[a].label || '';
      const labelB = words[b].label || '';
      return labelA.localeCompare(labelB);
    });

    const actualCols = Math.ceil(numWords / rows);
    const gridStartX = paddingX + (availableWidth - actualCols * cellWidth) / 2;

    targetPositions = new Array(numWords);
    for (let slotIndex = 0; slotIndex < numWords; slotIndex++) {
      const originalIndex = sortedIndices[slotIndex];
      const row = slotIndex % rows;
      const col = Math.floor(slotIndex / rows);
      
      const itemsInThisCol = Math.min(rows, numWords - col * rows);
      const colStartY = paddingY + (availableHeight - itemsInThisCol * cellHeight) / 2;
      
      const targetX = gridStartX + col * cellWidth + cellWidth / 2;
      const targetY = colStartY + row * cellHeight + cellHeight / 2;
      
      targetPositions[originalIndex] = { x: targetX, y: targetY };
    }
  };

  const getViewportHeight = () => {
    return window.innerHeight;
  };

  const bodyFor = (id: string) => {
    let found: Matter.Body | undefined;
    bodiesMap?.forEach((body, el) => {
      if (words[wordRefs.value.indexOf(el)]?.id === id) found = body;
    });
    return found;
  };

  // A word's card becomes its page title, so take its body out of the world
  const captureBody = (id: string) => {
    const body = bodyFor(id);
    if (!body) return;
    Matter.Body.setStatic(body, true);
    Matter.Body.setPosition(body, { x: -1000, y: -1000 });
  };

  // Put the card back where the page title was and let it drop into the pile
  const releaseBody = (id: string) => {
    const body = bodyFor(id) as any;
    if (!body) return;
    Matter.Body.setStatic(body, false);
    const targetLeft = titleLayout.value.x || 64;
    const targetTop = titleLayout.value.y || 104;
    Matter.Body.setPosition(body, {
      x: targetLeft + (body.prevWidth || 100) / 2,
      y: targetTop + (body.prevHeight || 40) / 2
    });
    Matter.Body.setAngle(body, 0);
    Matter.Body.setVelocity(body, { x: 0, y: 1 });
  };

  // Watch for route changes to sync physics state. Handles open, close and
  // page-to-page jumps (the old card drops while the new one flies up).
  watch(selectedId, (newId, oldId) => {
    wakeEngine(); // let the pile react to cards leaving and returning
    if (mouseConstraint) mouseConstraint.constraint.stiffness = newId ? 0 : 0.2;
    if (oldId && oldId !== newId) releaseBody(oldId);
    if (newId) captureBody(newId);
  }, { immediate: true });

  watch(isGravityOff, (val) => {
    wakeEngine();
    if (engine) {
      if (val) {
        engine.world.gravity.x = 0;
        engine.world.gravity.y = 0;
        bodiesMap?.forEach((body) => {
          Matter.Body.setVelocity(body, { x: body.velocity.x * 0.2, y: body.velocity.y * 0.2 });
          Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.2);
          // Disable collisions entirely while in Zero-Gravity to prevent words getting stuck
          body.collisionFilter.mask = 0;
        });
      } else {
        engine.world.gravity.x = 0;
        engine.world.gravity.y = 1;
        bodiesMap?.forEach((body) => {
          if (!body.isStatic) {
            // Re-enable collisions immediately upon return of gravity
            body.collisionFilter.mask = 0xFFFFFFFF;
            Matter.Body.setAngle(body, 0);
            Matter.Body.setVelocity(body, {  x: (Math.random() - 0.5) * 2.5,
              y: Math.random() * 2.5 });
            Matter.Body.setAngularVelocity(body,  (Math.random() - 0.03) * 0.03);
          }
        });
      }
    }
  });

  const initPhysics = async () => {
    await nextTick();
    if (!containerRef.value) return;

    if (engine) {
      Matter.Engine.clear(engine);
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    
    const width = containerRef.value.clientWidth;
    const height = getViewportHeight();
    lastWidth = width;
    lastHeight = height;
    
    const Engine = Matter.Engine,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;
          
    engine = Engine.create();
    if (isGravityOff.value) {
      engine.world.gravity.x = 0;
      engine.world.gravity.y = 0;
    }
    
    ground = Bodies.rectangle(width / 2, height + 50, width * 3, 100, { isStatic: true });
    wallLeft = Bodies.rectangle(-50, height / 2, 100, height * 4, { isStatic: true });
    wallRight = Bodies.rectangle(width + 50, height / 2, 100, height * 4, { isStatic: true });
    
    Composite.add(engine.world, [ground, wallLeft, wallRight]);
    
    bodiesMap = new Map();
    
    wordRefs.value.forEach((el, index) => {
      if (!el) return;
      
      const originalTransform = el.style.transform;
      el.style.transform = 'none';
      
      const rect = { width: el.offsetWidth, height: el.offsetHeight };
      const startX = Math.random() * (width - rect.width) + rect.width / 2;
      const startY = -Math.random() * 800 - 200;
      
      const word = words[index] as any;
      const weight = typeof word?.weight === 'number' ? word.weight : 0.5;

      const body = Bodies.rectangle(startX, startY, rect.width, rect.height, {
        ...PAPER,
        // Heavier words (bigger roles) land first and anchor the pile
        density: 0.0007 + weight * 0.0009,
        angle: (Math.random() - 0.5) * 1.2,
        chamfer: { radius: 4 },
        render: { visible: false }
      }) as any;
      body.wordIndex = index;
      body.flutterPhase = Math.random() * Math.PI * 2;
      
      el.style.transform = originalTransform;
      
      body.prevWidth = rect.width;
      body.prevHeight = rect.height;
      
      Composite.add(engine.world, body);
      bodiesMap!.set(el, body);
    });

    updateGridTargets();

    // Opened straight onto a page (direct link): that card is the page title, not in the pile
    if (selectedId.value) captureBody(selectedId.value);
    
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const speedA = pair.bodyA.speed || 0;
        const speedB = pair.bodyB.speed || 0;
        const force = speedA + speedB;
        
        // A hard landing kicks up a little paper dust
        if (force > 5 && explosionsEnabled) {
          const supports = pair.collision.supports;
          if (supports && supports.length > 0) {
            const contact = supports[0];
            const numParticles = Math.min(Math.floor(force / 2), 6);

            for (let i = 0; i < numParticles; i++) {
              particles.push({
                x: contact.x + (Math.random() - 0.5) * 24,
                y: contact.y,
                vx: (Math.random() - 0.5) * force * 0.16,
                vy: -Math.random() * force * 0.12,
                radius: Math.random() * 1.3 + 0.5,
                alpha: Math.random() * 0.25 + 0.2,
                decay: Math.random() * 0.008 + 0.008,
                color: 'rgb(222, 212, 190)'
              });
            }
          }
        }
      });
    });
    
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

    if (selectedId.value && mouseConstraint) mouseConstraint.constraint.stiffness = 0;

    // Wake engine on mouse/touch interaction
    Matter.Events.on(mouseConstraint, 'startdrag', (e: any) => {
      wakeEngine();
      if (e.body?.wordIndex !== undefined) hooks.onDragChange?.(e.body.wordIndex);
    });
    Matter.Events.on(mouseConstraint, 'enddrag', (e: any) => {
      const droppedInSlot = overSlot;
      if (overSlot) {
        overSlot = false;
        hooks.onSlotOver?.(false);
      }
      hooks.onDragChange?.(null);
      if (droppedInSlot && e.body?.wordIndex !== undefined) hooks.onSlotDrop?.(e.body.wordIndex);
    });
    if (containerRef.value) {
      containerRef.value.addEventListener('mousedown', wakeEngine);
      containerRef.value.addEventListener('touchstart', wakeEngine, { passive: true });
    }

    lastTimestamp = 0;
    wakeEngine();
    
    const syncLoop = (timestamp: number) => {
      rafId = requestAnimationFrame(syncLoop);

      if (!containerRef.value || !bodiesMap) return;

      // Keeps running while a detail page is open: the pile settles into the gap the
      // card left (and zero-g keeps floating) behind the frosted glass.

      const rawDelta = lastTimestamp ? timestamp - lastTimestamp : 16.667;
 
      
      // Track dropped frames to disable expensive explosions if struggling (< 30fps)
      if (rawDelta > 35) {
        droppedFramesScore += rawDelta;
        if (droppedFramesScore > 1000) {
          explosionsEnabled = false;
        }
      } else {
        droppedFramesScore = Math.max(0, droppedFramesScore - 10);
        if (droppedFramesScore === 0) {
          explosionsEnabled = true; // Recover if stable
        }
      }

      // Calculate delta for manual Engine.update (capped at 16.667ms to avoid Matter.js warnings and keep physics stable)
      const delta = Math.min(rawDelta, 1000 / 60);
      lastTimestamp = timestamp;

      // Step physics engine (skip when sleeping)
      if (!isSleeping) {
        Matter.Engine.update(engine, delta);
      }

      // Cached by the resize handler: reading layout every frame can force a reflow
      const vw = lastWidth || containerRef.value.clientWidth;
      const vh = lastHeight || getViewportHeight();

      if (isGravityOff.value) {
        floatTime += 0.015;
      }

      // --- Particle rendering (only when particles exist) ---
      const canvas = particleCanvasRef.value;
      if (canvas) {
        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (particles.length > 0) {
            ctx.clearRect(0, 0, vw, vh);

            for (let i = particles.length - 1; i >= 0; i--) {
              const p = particles[i];
              p.vy += 0.03; // dust settles
              p.vx *= 0.97;
              p.x += p.vx;
              p.y += p.vy;
              p.alpha -= p.decay;
              
              if (p.alpha <= 0) {
                // Swap-and-pop instead of splice for O(1) removal
                particles[i] = particles[particles.length - 1];
                particles.pop();
                continue;
              }
              
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1.0;
          } else if (canvas.width > 0) {
            // Only clear once when particles finish
            ctx.clearRect(0, 0, vw, vh);
          }
        }
      }

      // --- Skip DOM sync when sleeping (nothing moved) ---
      if (isSleeping) return;

      const rescueMarginX = vw * 0.5;
      const rescueMarginTop = vh * 2;
      const rescueMarginBottom = vh * 0.3;

      // Sleep detection: track if all bodies are settled (never while a word is held)
      const heldBody = mouseConstraint?.body as any;
      let allSettled = !isGravityOff.value && !heldBody;

      // Is the held word hovering over the hero blank?
      if (heldBody && heldBody.wordIndex !== undefined && hooks.getSlotRect) {
        const r = hooks.getSlotRect();
        const { x, y } = heldBody.position;
        const over = !!r &&
          x > r.left - SLOT_HIT_MARGIN && x < r.right + SLOT_HIT_MARGIN &&
          y > r.top - SLOT_HIT_MARGIN && y < r.bottom + SLOT_HIT_MARGIN;
        if (over !== overSlot) {
          overSlot = over;
          hooks.onSlotOver?.(over);
        }
      }

      wordRefs.value.forEach((el, index) => {
        const word = words[index];
        if (word && word.id === selectedId.value) return;

        const body = bodiesMap!.get(el) as any;
        if (body && el) {
          // Use cached dimensions instead of forcing layout reflow
          const hw = (body.prevWidth || 100) / 2;
          const hh = (body.prevHeight || 40) / 2;

          if (isGravityOff.value) {
            const target = targetPositions[index];
            if (target) {
              const uniqueOffset = index * 0.5;
              const bobX = Math.sin(floatTime + uniqueOffset) * 6;
              const bobY = Math.cos(floatTime * 0.85 + uniqueOffset) * 6;
              const bobAngle = Math.sin(floatTime * 0.4 + uniqueOffset) * 0.03;

              const tx = target.x + bobX;
              const ty = target.y + bobY;
              const ta = bobAngle;

              const isDragged = mouseConstraint && mouseConstraint.body === body;

              if (!isDragged) {
                const dx = tx - body.position.x;
                const dy = ty - body.position.y;
                
                Matter.Body.setVelocity(body, {
                  x: body.velocity.x * 0.75 + dx * 0.05,
                  y: body.velocity.y * 0.75 + dy * 0.05
                });
                
                let da = ta - body.angle;
                da = Math.atan2(Math.sin(da), Math.cos(da));
                Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.75 + da * 0.05);
              }
            }
          } else {
            // Flutter: falling paper sways side to side and rocks as it drops
            const isHeld = mouseConstraint && mouseConstraint.body === body;
            if (!isHeld && body.velocity.y > 1.2) {
              const k = Math.min(body.velocity.y, 9) / 9;
              const t = timestamp * 0.004 + body.flutterPhase;
              Matter.Body.setVelocity(body, {
                x: body.velocity.x + Math.sin(t) * 0.17 * k,
                y: body.velocity.y
              });
              Matter.Body.setAngularVelocity(body, body.angularVelocity + Math.cos(t) * 0.0012 * k);
            }

            let bx = body.position.x;
            let by = body.position.y;
            let rescued = false;

            if (bx < -rescueMarginX) { bx = hw + 20; rescued = true; }
            if (bx > vw + rescueMarginX) { bx = vw - hw - 20; rescued = true; }
            if (by < -rescueMarginTop) { by = -100; rescued = true; }
            if (by > vh + rescueMarginBottom) { by = vh - hh - 20; rescued = true; }

            if (rescued) {
              Matter.Body.setPosition(body, { x: bx, y: by });
              Matter.Body.setVelocity(body, { x: (vw / 2 - bx) * 0.02, y: 2 });
            }

            // Check if this body is still moving (for sleep detection)
            if (allSettled && (body.speed > SLEEP_SPEED_THRESHOLD || body.angularSpeed > SLEEP_SPEED_THRESHOLD)) {
              allSettled = false;
            }
          }

          const x = body.position.x - hw;
          const y = body.position.y - hh;
          
          el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
        }
      });

      // Sleep detection: bodies settled for enough frames → sleep
      if (allSettled && !isGravityOff.value) {
        sleepFrames++;
        if (sleepFrames >= SLEEP_FRAME_COUNT) {
          isSleeping = true;
        }
      } else {
        sleepFrames = 0;
      }
    };
    rafId = requestAnimationFrame(syncLoop);
  };

  const handleResize = () => {
    if (!containerRef.value || !bodiesMap) return;
    const newWidth = containerRef.value.clientWidth;
    const newHeight = getViewportHeight();

    const scaleFactorX = (lastWidth > 0 && newWidth > 0) ? newWidth / lastWidth : 1;
    const scaleFactorY = (lastHeight > 0 && newHeight > 0) ? newHeight / lastHeight : 1;

    lastWidth = newWidth;
    lastHeight = newHeight;

    containerRef.value.classList.add('is-resizing');
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      containerRef.value?.classList.remove('is-resizing');
    }, 200);

    containerRef.value.style.height = newHeight + 'px';

    if (ground && wallLeft && wallRight) {
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(wallLeft, { x: -50, y: newHeight / 2 });
      Matter.Body.setPosition(wallRight, { x: newWidth + 50, y: newHeight / 2 });
    }

    bodiesMap.forEach((body: any, el) => {
      if (!el || !body) return;
      const originalTransition = el.style.transition;
      const originalTransform = el.style.transform;
      const wasSelected = el.classList.contains('is-selected');
      
      el.style.transition = 'none';
      if (wasSelected) el.classList.remove('is-selected');
      el.style.transform = 'none';
      
      const newW = el.offsetWidth;
      const newH = el.offsetHeight;
      
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
      
      // Scale positions proportionally to match the screen layout transformation
      let targetX = body.position.x * scaleFactorX;
      let targetY = body.position.y * scaleFactorY;

      // Keep it within boundaries
      const halfW = newW / 2;
      const halfH = newH / 2;
      const padding = 20;

      if (targetX < halfW + padding) targetX = halfW + padding;
      if (targetX > newWidth - halfW - padding) targetX = newWidth - halfW - padding;
      if (targetY < halfH + padding) targetY = halfH + padding;
      if (targetY > newHeight - halfH - padding) targetY = newHeight - halfH - padding;

      Matter.Body.setPosition(body, { x: targetX, y: targetY });
      // Reset velocity to prevent massive momentum build-up during window resizing dragging
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
    });

    updateGridTargets();
  };

  let lastGx = 0;
  let lastGy = 1;

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (!engine || selectedId.value || isGravityOff.value || event.gamma === null || event.beta === null) return;
    wakeEngine();

    const gx = Math.max(-1.5, Math.min(1.5, (event.gamma || 0) / 30));
    const gy = Math.max(-1.5, Math.min(1.5, (event.beta || 0) / 30));

    if (Math.abs(gx - lastGx) > 0.05 || Math.abs(gy - lastGy) > 0.05) {
      engine.world.gravity.x = gx;
      engine.world.gravity.y = gy;
      lastGx = gx;
      lastGy = gy;

      if (gravityRecoveryTimer) clearTimeout(gravityRecoveryTimer);
      gravityRecoveryTimer = setTimeout(() => {
        if (!engine) return;
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

  const preventPullToRefresh = (e: TouchEvent) => {
    // Only prevent pull-to-refresh when no modal is open and the touch is inside the gravity container
    if (selectedId.value) return;
    const target = e.target as HTMLElement;
    if (containerRef.value && containerRef.value.contains(target)) {
      e.preventDefault();
    }
  };

  const startOrientationListening = () => {
    window.addEventListener('deviceorientation', handleOrientation);
  };

  const requestOrientationPermission = () => {
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      // iOS 13+ requires permission from a user gesture
      DOE.requestPermission()
        .then((state: string) => {
          if (state === 'granted') {
            startOrientationListening();
          }
        })
        .catch(() => {
          // Permission denied or failed — silently continue without accelerometer
        });
    } else {
      // Android and other browsers — just start listening
      startOrientationListening();
    }
  };

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.style.height = window.innerHeight + 'px';
    }

    if (document.fonts) {
      // Wait for every card font so physics bodies match the real card sizes
      const timeout = new Promise(resolve => setTimeout(resolve, 2500));
      Promise.race([document.fonts.ready, timeout]).finally(() => {
        setTimeout(initPhysics, 100);
      });
    } else {
      setTimeout(initPhysics, 200);
    }

    window.addEventListener('resize', handleResize);

    // Request orientation permission on first user interaction (required by iOS)
    if (window.DeviceOrientationEvent) {
      const onFirstInteraction = () => {
        requestOrientationPermission();
        containerRef.value?.removeEventListener('touchstart', onFirstInteraction);
        window.removeEventListener('click', onFirstInteraction);
      };
      containerRef.value?.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
      // Also listen for click as fallback (e.g. desktop with accelerometer)
      window.addEventListener('click', onFirstInteraction, { once: true });
    }

    document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (window.DeviceOrientationEvent) {
      window.removeEventListener('deviceorientation', handleOrientation);
    }
    if (containerRef.value) {
      containerRef.value.removeEventListener('mousedown', wakeEngine);
      containerRef.value.removeEventListener('touchstart', wakeEngine);
    }
    document.removeEventListener('touchmove', preventPullToRefresh);
    if (gravityRecoveryTimer) clearTimeout(gravityRecoveryTimer);
    if (rafId) cancelAnimationFrame(rafId);
    if (engine) Matter.Engine.clear(engine);
  });
}
