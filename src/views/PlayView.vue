
<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "../components/Card.vue";

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
        backgroundColor: "#131418",
        ease: "none",
      });
    },
  },
  components: {
    Card,
  },
};
</script>

<template>
  <div ref="page" class="page">
    <div class="background"></div>
    <img class="grunge" src="/assets/img/play/grunge.svg" />

    <div class="trees">
      <img
        class="tree"
        src="/assets/img/play/tree.svg"
        :style="{ width: '32%', top: '-30px' }"
      />
      <img
        class="tree"
        src="/assets/img/play/tree.svg"
        :style="{ width: '28%', transform: 'rotate(2deg)', top: '390px' }"
      />
      <img
        class="tree"
        src="/assets/img/play/tree.svg"
        :style="{ width: '24%', transform: 'rotate(180deg)', right: 0 }"
      />
      <img
        class="tree"
        src="/assets/img/play/tree.svg"
        :style="{
          width: '32%',
          transform: 'rotate(181deg)',
          top: '340px',
          right: 0,
        }"
      />
      <div class="block">
        <h1>Play</h1>
        <p>
          When I'm not developing software I have many other ways I find to pass
          my time.
        </p>
        <div class="cards">
          <Card img="noun-motocross-4706122.svg" desc="Riding Dirtbikes" />
          <Card img="noun-chicken-5412599.svg" desc="Raising Chickens" />
          <Card img="noun-saw-table-3437774.svg" desc="Wood Working" />
          <Card img="noun-gluten-4321747.svg" desc="Growing Food" />
          <Card img="noun-concert-5674382.svg" desc="Concert and music" />
          <Card img="noun-cooking-2555746.svg" desc="Cooking" />
        </div>
      </div>
    </div>
    <img class="grunge bottom" src="/assets/img/play/grungeUp.svg" />
  </div>
</template>
<style scoped>
.page {
  padding-top: -0px;
  height: 1200px;
  background-color: #495b8a;
}
.grunge {
  width: 100%;
  /* filter: drop-shadow(3px 5px 2px rgba(26, 43, 99, 0.699)); */
}

.grunge.bottom{
  width: 100%;
  position: absolute;
    bottom: 0; 
}
.block {
  color: rgb(255, 255, 255);
  width: 500px;margin-top: 60px;
  text-align: center;
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
.cards {
  width: 550px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  row-gap: 30px;
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
  animation: rotateBackground 160s linear infinite;
  background: url(/assets/img/play/stars.prod.svg) 0 0 repeat;
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
