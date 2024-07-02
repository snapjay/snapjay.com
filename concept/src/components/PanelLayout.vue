<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: false
  },
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
  <div class="panel" :style="panelStyle" :class="{ invert: props.invert }">
    <h1 v-if="title" class="pad">{{ title }}</h1>
    <slot></slot>
  </div>
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
}

.panel.invert {
  background-color: #fff;
}

.panel:hover {
  opacity: 1;
  z-index: 1;
  filter: grayscale(0%);
}
</style>
