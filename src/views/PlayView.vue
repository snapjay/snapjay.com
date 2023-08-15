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
          <Card img="noun-motocross-4706122.svg" title="Dirtbike" desc="I derive immense enjoyment from traversing the rocky terrains of the mountains on my dirtbike. Exploring intricate trails, I revel in the discovery of picturesque and secluded locations that exude natural beauty." />
          <Card img="noun-chicken-5412599.svg" title="Chickens" desc="I have nurtured a brood of seven chickens, beginning their journey when they were merely two weeks old. Over time, these feathered companions have evolved into beloved pets, enhancing my daily life with both their companionship and the reward of a consistent supply of fresh eggs." />
          <Card img="noun-saw-table-3437774.svg" title="Wood Working" desc="Woodworking is a passion of mine, and I have taken this interest to the next level by establishing a small woodshop. My proficiency in web skills seamlessly transitions to my work with Computer Numerical Control (CNC) machinery, where I leverage my expertise to create intricate wood designs and projects." />
          <Card img="noun-gluten-4321747.svg" title="Growing Food" desc="Cultivating my own food is a deeply ingrained passion of mine. I possess a profound interest in the realm of agriculture and food production, driven by a fervent desire to create sustenance from the ground up. My dedication extends to crafting items from scratch whenever possible, reflecting my commitment to a holistic approach to nourishment and self-sufficiency." />
          <Card img="noun-concert-5674382.svg" title="Country Music" desc="Country music holds a special place in my heart, and I find solace and enjoyment in its melodies. Attending concerts beneath the open sky is an experience I cherish, as the combination of live country music and the vast expanse of stars creates a truly magical ambiance." />
          <Card img="noun-cooking-2555746.svg" title="Cooking" desc="Taking pleasure in the full cycle of nourishment, I relish the process of cultivating my own food, nurturing my chickens for their eggs, and subsequently utilizing these homegrown ingredients to prepare meals. This complete journey from seed to plate brings me immense satisfaction and a profound connection to the sustenance I create." />
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
