<script setup>
import { onMounted, ref, defineEmits } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  project: Object,
  left: Number
})

const emit = defineEmits(['pickUpCard', 'putCardDown'])
const card = ref(null)
const front = ref(null)
const back = ref(null)
let isOpen = false
let tl

const pickUpCard = () => {
  if (isOpen) return
  isOpen = true
  gsap.to(card.value, { duration: 0.1, left: 180 })
  card.value.style.zIndex = 50
  tl.play()
  emit('pickUpCard', props.project.id)
}

const putCardDown = () => {
  if (!isOpen) return
  isOpen = false
  gsap.to(card.value, { duration: 0.1, left: props.left })
  tl.reverse().then(() => {
    card.value.style.zIndex = 0
  })
  emit('putCardDown', props.project.id)
}

const setupEvents = () => {
  gsap.set(card.value, {
    transformStyle: 'preserve-3d',
    transformPerspective: 1000,
    left: props.left
  })
  document.addEventListener('click', putCardDown)
  gsap.set(back.value, { rotationY: -180 })
  tl = gsap.timeline({ paused: true })
    .to(front.value, { duration: 1, rotationY: 180 })
    .to(back.value, { duration: 1, rotationY: 0, scale: 2.3 }, 0)
}

onMounted(setupEvents)
defineExpose({ id: props.project.id, pickUpCard, putCardDown })
</script>
<template>
  <div ref="card" class="card">
    <div ref="back" class="cardBack">
      <span class="close-icon" @click.stop="putCardDown">✖</span>
      <h3 class="black">{{ project.title }}</h3>
      <p>{{ project.desc }}</p>
      <slot></slot>
    </div>
    <div ref="front" class="cardFront" @click="pickUpCard">
      <img :src="`/assets/img/play/${project.img}`" :alt="`Representation of ${project.title}`" />
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 150px;
  height: 216px;
  position: relative;
  cursor: grab;
}

.cardFront,
.cardBack {
  position: absolute;
  width: 150px;
  height: 216px;
  background: url('/assets/img/play/card.svg');
  background-size: cover;
  -visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  color: #000;
  border-radius: 8px;
}

.cardBack h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.cardBack p {
  font-size: 0.5rem;
}

.cardBack {
  padding: 0.5rem;
  background: #fff;
  box-shadow: 0 0 10px 4px rgba(0, 5, 10, 0.75);
}

.cardFront {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/assets/img/play/card.svg');
}

.card:hover {
  z-index: 2;
}

.close-icon {
  float: right;
  cursor: pointer;
  margin-left: 10px;
  font-size: 0.75rem;
  line-height: 1;
}
</style>
