<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Matter from 'matter-js'
import words from './data/words.json'

const containerRef = ref(null)
const wordRefs = ref([])
let engine, render, runner;

onMounted(async () => {
  await nextTick()
  if (!containerRef.value) return;
  
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight || 800;
  
  const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;
        
  engine = Engine.create();
  
  // Point gravity upwards
  engine.gravity.y = -1;
  
  // Ceiling to catch words floating up
  const ceiling = Bodies.rectangle(width / 2, -50, width * 2, 100, { isStatic: true });
  // Tall walls that extend well below the screen to guide spawning words
  const wallLeft = Bodies.rectangle(-50, height / 2, 100, height * 4, { isStatic: true });
  const wallRight = Bodies.rectangle(width + 50, height / 2, 100, height * 4, { isStatic: true });
  
  Composite.add(engine.world, [ceiling, wallLeft, wallRight]);
  
  const bodiesMap = new Map();
  
  wordRefs.value.forEach((el, index) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const startX = Math.random() * (width - rect.width) + rect.width / 2;
    // Space them out vertically so they don't overlap and explode!
    const startY = height + 100 + index * 200 + Math.random() * 100;
    
    const body = Bodies.rectangle(startX, startY, rect.width, rect.height, {
      restitution: 0.5,
      friction: 0.1,
      chamfer: { radius: 10 },
      render: { visible: false }
    });
    
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
    wordRefs.value.forEach((el) => {
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
});

onUnmounted(() => {
  if (runner) Matter.Runner.stop(runner);
  if (engine) Matter.Engine.clear(engine);
});


</script>

<template>
  <div class="gravity-container" ref="containerRef">
    <div 
      v-for="(word, index) in words" 
      :key="word.id"
      ref="wordRefs"
      class="gravity-word"
      :style="{ 
        backgroundImage: `url(${word.image})`, 
        fontSize: `${3 + word.weight * 5}rem`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent'
      }"
      v-html="word.label.replace(' ', '<br>')"
    ></div>
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
  text-align: center;
  text-transform: uppercase;
  background-size: cover;
  background-position: center;
  
  user-select: none;
  cursor: grab;
  
  /* Start off-screen */
  transform: translateY(-2000px);
}

.gravity-word:active {
  cursor: grabbing;
}
</style>
