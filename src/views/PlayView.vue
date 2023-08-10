
<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default {
  name: "PlayView",
  mounted() {
    this.setupScrollSnapping();
  },
  methods: {
    setupScrollSnapping() {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(this.$refs.page, {
        scrollTrigger: {
          trigger: this.$refs.page,
          start: "-400px top",
          scrub: true,
        },
        duration: 1,
        backgroundColor: '#121d3c',
        ease: "none",
      });
    },
  },
};
</script>

<template>
  <div ref="page" class="page">
    <div class="background"></div>

    <div class="trees">
      <img
        class="tree"
        src="/assets/img/tree.svg"
        :style="{ width: '32%', top: '-30px' }"
      />
      <img
        class="tree"
        src="/assets/img/tree.svg"
        :style="{ width: '28%', transform: 'rotate(2deg)', top: '390px' }"
      />
      <img
        class="tree"
        src="/assets/img/tree.svg"
        :style="{ width: '24%', transform: 'rotate(180deg)', right: 0 }"
      />
      <img
        class="tree"
        src="/assets/img/tree.svg"
        :style="{
          width: '32%',
          transform: 'rotate(181deg)',
          top: '340px',
          right: 0,
        }"
      />
      <div class="block">
        <h1>Play</h1>
        <h2>Who am I?</h2>
        <p>When I'm not behind a screen</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page {
  background-color:   #495b8a;
}
.block {
  color: rgb(255, 255, 255);
  width: 500px;
}
.trees {
  position: relative;
}
.tree {
  position: absolute;
  top: 1px;
  z-index: -1;

  width: 35%;
}
.background::before {
  content: "";
  overflow: hidden;
  position: absolute;
  width: 3000px;
  height: 3000px;
  border-radius: 50%;
  top: -60%;
  left: -30%;
  transform-origin: center center; /* Rotate from center */
  z-index: -1;
  background: url(../assets/img/stars.prod.svg) 0 0 repeat;
  animation: rotateBackground 160s linear infinite;
  /* background-color: rgb(43, 47, 94); */
  transform: skewY(-2deg);
}

@keyframes rotateBackground {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
