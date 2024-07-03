<script setup>
import CanvasLayout from './components/CanvasLayout.vue'

const scrollToEnd = () => {
  window.scrollTo({
    left: 0,
    behavior: 'smooth'
  });
}
</script>

<template>
  <header>
    <h1 @click="scrollToEnd">Snap<span>jay</span></h1>
  </header>
  <CanvasLayout />
</template>

<style scoped>
header {
  line-height: 1.5;
  position: fixed;
  background: var(--color-background);
  height: 100%;
  width: 156px;
  z-index: 100;
  left: 0;
  top: 0;
  box-shadow: 4px 0px 10px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 900px) {
  header {
    display: none;
  }
}

h1 {
  transform: rotate(-90deg);
  position: absolute;
  left: -170px;
  top: 210px;
  font-size: 10rem;
  cursor: pointer;
}

h1 span {

  transition: color 0.9s;
}

h1:hover span {
  color: #3592bf;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
