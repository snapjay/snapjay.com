<script>
import gsap from "gsap";
export default {
  name: "Card",
  mounted() {
    this.setupScrollSnapping();
  },
  props: {
    img: String,
    desc: String,
  },
  methods: {
    setupScrollSnapping() {
      const card = this.$refs.card;
      const front = this.$refs.front;
      const back = this.$refs.back;
      gsap.set(card, {
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      });

      gsap.set(back, { rotationY: -180 });

      const tl = gsap
        .timeline({ paused: true })
        .to(front, { duration: 1, rotationY: 180 })
        .to(back, { duration: 1, rotationY: 0, scale: 1.8 }, 0)
        .to(card, { z: 50 }, 0)
        .to(card, { z: 0 }, 0.5);
      card.addEventListener("mouseenter", function () {
        tl.play();
      });
      card.addEventListener("mouseleave", function () {
        tl.reverse();
      });
    },
  },
};
</script>
<template>
  <div ref="card" class="cardCont">
    <div ref="back" class="cardBack">
      <p>{{ desc }}</p>
    </div>
    <div ref="front" class="cardFront">
      <img :src="`/assets/img/play/${img}`" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cardCont {
  width: 150px;
  height: 216px;
  position: relative;
}
.cardFront,
.cardBack {
  position: absolute;
  box-shadow: 0px 0px 10px 0px rgba(5, 28, 54, 0.75);
  width: 150px;
  height: 216px;
  background: url("/assets/img/play/card.svg");
  background-size: cover;
  -visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  color: #000;
  border-radius: 8px;
  p {
    padding: 10px;
    font-size: 10px;
  }
}

.cardBack {
  background: #fff;
}
.cardFront {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("/assets/img/play/card.svg");
}

.cardCont:hover {
  z-index: 2;
}
</style>