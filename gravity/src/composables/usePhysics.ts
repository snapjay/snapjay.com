import { watch, onMounted, onUnmounted, nextTick, Ref } from 'vue';
import Matter from 'matter-js';
import words from '../words.json';

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
  titleLayout: Ref<TitleLayout>
) {
  let engine: Matter.Engine;
  let runner: Matter.Runner;
  let ground: Matter.Body;
  let wallLeft: Matter.Body;
  let wallRight: Matter.Body;
  let bodiesMap: Map<HTMLElement, Matter.Body> | undefined;
  let mouseConstraint: Matter.MouseConstraint | undefined;
  let gravityRecoveryTimer: ReturnType<typeof setTimeout> | null = null;
  let particles: any[] = [];

  const getViewportHeight = () => {
    return window.innerHeight;
  };

  // Watch for route changes to sync physics state
  watch(selectedId, (newId, oldId) => {
    if (newId) {
      if (mouseConstraint) mouseConstraint.constraint.stiffness = 0;
      
      bodiesMap?.forEach((body, el) => {
        const index = wordRefs.value.indexOf(el);
        const word = words[index];
        if (word && word.id === newId) {
          Matter.Body.setStatic(body, true);
          Matter.Body.setPosition(body, { x: -1000, y: -1000 });
        }
      });
    } else if (oldId) {
      if (mouseConstraint) mouseConstraint.constraint.stiffness = 0.2;
      
      bodiesMap?.forEach((body, el) => {
        const index = wordRefs.value.indexOf(el);
        const word = words[index];
        if (word && word.id === oldId) {
          Matter.Body.setStatic(body, false);
          
          const targetLeft = titleLayout.value.x || 64;
          const targetTop = titleLayout.value.y || 104;
          
          Matter.Body.setPosition(body, {
            x: targetLeft + el.offsetWidth / 2,
            y: targetTop + el.offsetHeight / 2
          });
          Matter.Body.setAngle(body, 0);
          Matter.Body.setVelocity(body, { x: 0, y: 1 });
        }
      });
    }
  }, { immediate: true });

  const initPhysics = async () => {
    await nextTick();
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
      
      const body = Bodies.rectangle(startX, startY, rect.width, rect.height, {
        restitution: 0.5,
        friction: 0.1,
        angle: (Math.random() - 0.5) * 1.5,
        chamfer: { radius: 4 },
        render: { visible: false }
      }) as any;
      
      el.style.transform = originalTransform;
      
      body.prevWidth = rect.width;
      body.prevHeight = rect.height;
      
      Composite.add(engine.world, body);
      bodiesMap!.set(el, body);
    });
    
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const speedA = pair.bodyA.speed || 0;
        const speedB = pair.bodyB.speed || 0;
        const force = speedA + speedB;
        
        if (force > 8) {
          const supports = pair.collision.supports;
          if (supports && supports.length > 0) {
            const contact = supports[0];
            const numParticles = Math.min(Math.floor(force / 2), 6);
            
            for (let i = 0; i < numParticles; i++) {
              particles.push({
                x: contact.x,
                y: contact.y,
                vx: (Math.random() - 0.5) * force * 0.5,
                vy: (Math.random() - 0.5) * force * 0.5 - Math.random() * 2,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.6 + 0.4,
                decay: Math.random() * 0.04 + 0.02
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
    
    runner = Runner.create();
    Runner.run(runner, engine);
    
    const syncLoop = () => {
      if (!containerRef.value || !bodiesMap) return;
      const vw = containerRef.value.clientWidth;
      const vh = getViewportHeight();

      const canvas = particleCanvasRef.value;
      if (canvas) {
        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
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
              ctx.fillStyle = 'rgba(20, 20, 24, 0.8)';
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
          }
        }
      }

      const rescueMarginX = vw * 0.5;
      const rescueMarginTop = vh * 2;
      const rescueMarginBottom = vh * 0.3;

      wordRefs.value.forEach((el, index) => {
        const word = words[index];
        if (word && word.id === selectedId.value) return;

        const body = bodiesMap!.get(el);
        if (body && el) {
          const hw = el.offsetWidth / 2;
          const hh = el.offsetHeight / 2;
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

          const x = body.position.x - hw;
          const y = body.position.y - hh;
          
          el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;

          const speed = body.speed || 0;
          const letterSpans = el.querySelectorAll('.cloth-letter') as NodeListOf<HTMLElement>;
          
          if (speed > 2) {
            const intensity = Math.min((speed - 2) * 0.8, 10);
            const time = performance.now() * 0.006;
            
            letterSpans.forEach((span, li) => {
              const phase = li * 0.5 + time;
              const yOffset = Math.sin(phase) * intensity;
              const rot = Math.sin(phase + 0.4) * intensity * 0.6;
              span.style.transform = `translateY(${yOffset}px) rotate(${rot}deg)`;
            });
          } else {
            letterSpans.forEach(span => {
              if (span.style.transform) span.style.transform = '';
            });
          }
        }
      });
      requestAnimationFrame(syncLoop);
    };
    syncLoop();
  };

  const handleResize = () => {
    if (!containerRef.value || !bodiesMap) return;
    const newWidth = containerRef.value.clientWidth;
    const newHeight = getViewportHeight();

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
      
      const padding = 40;
      let targetX = body.position.x;
      let targetY = body.position.y;

      if (targetX < padding) targetX = padding + newW/2;
      if (targetX > newWidth - padding) targetX = newWidth - padding - newW/2;
      if (targetY > newHeight - padding) targetY = newHeight - padding - newH/2;

      if (targetX !== body.position.x || targetY !== body.position.y) {
        Matter.Body.setPosition(body, { x: targetX, y: targetY });
        Matter.Body.setVelocity(body, { x: 0, y: 1 });
      }
    });
  };

  let lastGx = 0;
  let lastGy = 1;

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (!engine || selectedId.value || event.gamma === null || event.beta === null) return;

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
    if (document.scrollingElement && document.scrollingElement.scrollTop <= 0) {
      e.preventDefault();
    }
  };

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.style.height = window.innerHeight + 'px';
    }

    if (document.fonts) {
      document.fonts.load('900 1rem "Bebas Neue"').catch(() => {
        console.warn('Font loading timed out or failed, proceeding with fallback metrics');
      }).finally(() => {
        setTimeout(initPhysics, 200);
      });
    } else {
      setTimeout(initPhysics, 200);
    }

    window.addEventListener('resize', handleResize);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (window.DeviceOrientationEvent) {
      window.removeEventListener('deviceorientation', handleOrientation);
    }
    document.removeEventListener('touchmove', preventPullToRefresh);
    if (gravityRecoveryTimer) clearTimeout(gravityRecoveryTimer);
    if (runner) Matter.Runner.stop(runner);
    if (engine) Matter.Engine.clear(engine);
  });
}
