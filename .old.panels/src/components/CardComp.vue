<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  project: Object,
  left: Number
})

const emit = defineEmits(['pickUpCard', 'putCardDown'])
const card = ref(null)
const front = ref(null)
const back = ref(null)
let isOpen = ref(false)
let tl

const pickUpCard = () => {
  if (isOpen.value) return
  isOpen.value = true
  gsap.to(card.value, { duration: 0.1, left: 180 })
  card.value.style.zIndex = 50
  tl.play()
  emit('pickUpCard', props.project.id)
}

const putCardDown = () => {
  if (!isOpen.value) return
  isOpen.value = false
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
  <div ref="card" class="card" tabindex="0" @keyup.enter="pickUpCard">
    <div ref="back" class="cardBack" @keyup.escape="putCardDown"
      :style="{ backgroundImage: isOpen && `url('/assets/cards/${project.frontImage}')` }">
      <div class="inner">
        <span class="close-icon" tabindex="0" @click.stop="putCardDown" @keyup.enter="putCardDown">✖</span>
        <h2 class="black">{{ project.title }}</h2>
        <p>{{ project.desc }}</p>  
        <slot></slot>
      </div>
    </div>
    <div ref="front" class="cardFront" @click="pickUpCard">
      <img :src="`/assets/img/play/${project.backImage.url}`" :width="project.backImage.width"
        :height="project.backImage.height" :alt="`Representation of ${project.title}`" />
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
  background-size: cover;
  -visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  color: #000;
  border-radius: 8px;
}

.cardBack h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.cardBack p {
  font-size: 0.5rem;
  font-weight: 500;
}

.cardBack {
  background: #fff;
  background-size: 100% auto;
  box-shadow: 0 0 10px 4px rgba(0, 5, 10, 0.75);
}

.cardBack .inner {
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.85);
  height: 100%;
  padding: 0.75rem;
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
