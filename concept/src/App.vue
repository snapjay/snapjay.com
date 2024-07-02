<script setup>
import CanvasLayout from './components/CanvasLayout.vue'
</script>

<template>
  <header>
    <h1>Snapjay</h1>
  </header>
  <CanvasLayout />
</template>

<style scoped>
header {
  line-height: 1.5;
}

h1 {
  transform: rotate(-90deg);
  position: absolute;
  left: -170px;
  top: 210px;
  font-size: 10rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
