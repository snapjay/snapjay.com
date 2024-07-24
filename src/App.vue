<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import CanvasLayout from './components/CanvasLayout.vue'
import Navigator from './components/NavigatorComp.vue'

const scrollToEnd = () => {
  window.scrollTo({
    left: 0,
    behavior: 'smooth'
  });
}

let activeElement = ref(document.activeElement)
provide('isFocused', activeElement)

onMounted(() => {
  document.addEventListener('focus', () => {
    activeElement.value = document.activeElement
  }, true);
});



</script>

<template>
  <header>
    <div class="slide">
      <a href="mailto:dan@snapjay.com" alt="Email" target="_blank" rel="noopener noreferrer"><img
          src="/assets/img/connect/email.svg" alt="Snapjay" class="logo" width="140" height="140" /></a>
      <h1 @click="scrollToEnd">
        Snap<span>jay</span>
      </h1>
    </div>
  </header>
  <CanvasLayout />
  <Navigator />
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

.slide {
  transform: rotate(-90deg);
  position: absolute;
  left: -240px;
  top: 260px;
  display: grid;
  grid-template-columns: 180px 1fr;
}

h1 {
  font-size: 10rem;
}

img {
  width: 140px;
  filter: grayscale(100%);
  opacity: 0.5;
  transition: opacity 0.9s, filter 0.9s;
  cursor: pointer;
}

h1 span {
  transition: color 0.9s;
}

.slide:hover span {
  color: #3592bf;
}

.slide:hover img {
  filter: none;
  opacity: 1;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
