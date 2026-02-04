<script setup>
import { computed, ref, inject, watch } from 'vue'

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


const panelElement = ref(null);
const isFocused = ref(false);

const injectIsFocused = inject('isFocused');
watch(injectIsFocused, (newValue, oldValue) => {
  if (panelElement.value && panelElement.value.contains(newValue)) {
    isFocused.value = true;
  } else {
    isFocused.value = false;
  }
});


const focus = () => {
    panelElement.value.focus({ preventScroll: true });
}

defineExpose({ focus });
</script>

<template>
  <section class="panel" ref="panelElement" :style="panelStyle" :class="{ invert: props.invert, focused: isFocused }"
    tabindex="0" @mouseenter="focus">
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
  opacity: 0.4;
  filter: grayscale(100%);
  transition:
    box-shadow 0.9s,
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

.panel:hover,
.panel:focus,
.panel.focused {
  outline: none;
  opacity: 1;
  z-index: 1;
  filter: grayscale(0%);
  box-shadow: 0 0 0.75rem rgba(245, 244, 188, 0.842);
}
</style>
