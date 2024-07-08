<script setup>
import { computed } from 'vue'

const props = defineProps({
  background: {
    type: String,
    required: false
  },
  cover: {
    type: Boolean,
    required: false,
    default: true
  },
  invert: {
    type: Boolean,
    required: false,
    default: false
  }
})
const panelStyle = computed(() => ({
  backgroundImage: props.background ? `url(/assets/bg/${props.background})` : '',
  backgroundSize: props.cover ? 'cover' : 'contain'
}))
</script>

<template>
  <section class="panel" :style="panelStyle" :class="{ invert: props.invert }">
    <slot></slot>
  </section>
</template>

<style scoped>
.panel {
  background-color: black;
  background-position: center;
  position: relative;
  border-radius: 0.5rem;
  height: fit-content;
  opacity: 0.3;
  filter: grayscale(100%);
  transition:
    filter 0.9s,
    opacity 0.9s;
  z-index: 0;
  max-width: 500px;
}

@media (max-width: 1200px) {
  .panel {
    width: 100%;
    margin-bottom: 2rem;
    opacity: 1;
    filter: none;
    border-radius: 0;
  }
}

.invert {
  background-color: #fff;
  padding: 0;
}

.panel:hover {
  opacity: 1;
  z-index: 1;
  filter: grayscale(0%);
  box-shadow: 0 0 1rem rgba(245, 244, 188, 0.842);
}
</style>
