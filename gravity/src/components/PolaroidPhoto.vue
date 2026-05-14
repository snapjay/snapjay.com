<script setup>
import { computed } from 'vue';

const props = defineProps({
  src: String,
  caption: String
})

const randomRotation = Math.random() * 7 - 3.5; // Random rotation between -5 and 5 deg

const fontSize = computed(() => {
  if (!props.caption) return '2rem';
  const len = props.caption.length;
  if (len < 20) return '2.2rem';
  if (len < 35) return '2rem';
  if (len < 50) return '1.8rem';
  return '1.5rem';
});
</script>

<template>
  <div class="polaroid-wrapper">
    <div class="polaroid" :style="{ transform: `rotate(${randomRotation}deg)` }">
      <div class="photo-container">
        <img :src="src" :alt="caption" />
        <div class="photo-glare"></div>
      </div>
      <div class="caption-container">
        <div class="caption" :style="{ fontSize: fontSize }">
          {{ caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');

.polaroid-wrapper {
  padding: 1rem;
  perspective: 1000px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.polaroid {
  /* Off-white paper color and subtle SVG noise for texture */
  background-color: #fcfcfc;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E");
  padding: 1.2rem;
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.2),
    0 10px 30px rgba(0,0,0,0.1),
    inset 0 0 20px rgba(0,0,0,0.03); /* slight inner shadow for aging */
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(0,0,0,0.08);
}

.polaroid-wrapper:hover {
  transform: rotate(1deg) scale(1.02) translateY(-10px);
  z-index: 10;
}

.photo-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #222;
  position: relative;
  border: 2px solid rgba(0,0,0,0.15);
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(1.05) saturate(0.9);
}

.photo-glare {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%);
  pointer-events: none;
  mix-blend-mode: screen;
}

.caption-container {
  margin-top: 1rem;
  height: 4.5rem; /* Fixed height to enforce paper shape */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* prevents pushing the bottom down */
}

.caption {
  font-family: 'Reenie Beanie', cursive;
  color: #1a337a; /* Deep blue ink color */
  text-align: center;
  line-height: 1.1;
  transform: rotate(-1.5deg);
  opacity: 0.85;
  text-wrap: balance;
  width: 100%;
  /* Optional: subtle ink bleed effect */
  text-shadow: 0px 0px 1px rgba(26, 51, 122, 0.2);
}
</style>
