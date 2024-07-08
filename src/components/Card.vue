<script>
import gsap from 'gsap'
export default {
  name: 'CardComponent',
  mounted() {
    this.setupScrollSnapping()
  },
  props: {
    img: String,
    title: String,
    desc: String
  },
  methods: {
    setupScrollSnapping() {
      const card = this.$refs.card
      const front = this.$refs.front
      const back = this.$refs.back
      gsap.set(card, {
        transformStyle: 'preserve-3d',
        transformPerspective: 1000
      })

      gsap.set(back, { rotationY: -180 })

      const tl = gsap
        .timeline({ paused: true })
        .to(front, { duration: 1, rotationY: 180 })
        .to(back, { duration: 1, rotationY: 0, scale: 2.3 }, 0)
      card.addEventListener('mouseenter', function () {
        card.style.zIndex = 50
        tl.play()
      })
      card.addEventListener('mouseleave', function () {
        tl.reverse().then(() => {
          card.style.zIndex = 0
        })
      })
    }
  }
}
</script>
<template>
  <div ref="card" class="card">
    <div ref="back" class="cardBack">
      <h3 class="black">{{ title }}</h3>
      <p>{{ desc }}</p>
      <slot></slot>
    </div>
    <div ref="front" class="cardFront">
      <img :src="`/assets/img/play/${img}`" :alt="`Representaion of ${title}`" />
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
  color: #000;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/assets/img/play/card.svg');
}

.card:hover {
  z-index: 2;
}
</style>
