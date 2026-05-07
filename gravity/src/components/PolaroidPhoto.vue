<script setup>
defineProps({
  src: String,
  caption: String
})
</script>

<template>
  <div class="polaroid-wrapper">
    <div class="polaroid">
      <div class="photo-container">
        <img :src="src" :alt="caption" />
        <div class="photo-glare"></div>
      </div>
      <div class="caption">
        {{ caption }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');

.polaroid-wrapper {
  padding: 1rem;
  perspective: 1000px;
}

.polaroid {
  background: #fdfdfd;
  padding: 1.2rem 1.2rem 3rem 1.2rem;
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.2),
    0 10px 30px rgba(0,0,0,0.1);
  transform: rotate(-2deg);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(0,0,0,0.05);
}

.polaroid:hover {
  transform: rotate(1deg) scale(1.02) translateY(-10px);
  z-index: 10;
}

.photo-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #222;
  position: relative;
  border: 1px solid rgba(0,0,0,0.1);
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
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.caption {
  margin-top: 1.5rem;
  font-family: 'Reenie Beanie', cursive;
  font-size: 2rem;
  color: #1e3a8a; /* Deep blue ink color */
  text-align: center;
  line-height: 1;
  transform: rotate(-1deg);
  opacity: 0.9;
}
</style>
